import getPort from 'get-port';

import {sevenOnePattern} from '../utils.js';



/*
 * =============================================================================
 * Prompts
 * =============================================================================
 */

const prompts = async generator =>
  generator.prompt([
    {
      type: 'confirm',
      name: 'viewsTask',
      message: 'Use Views task?',
      when: generator.answers.type === 'package',
    },
    {
      type: 'list',
      name: 'views',
      message: 'Language:',
      choices: [
        {
          name: 'Pug',
          value: 'pug',
        },
        {
          name: 'PHP',
          value: 'php',
        },
      ],
      when: answers => generator.answers.type !== 'package' || answers.viewsTask,
    },
    {
      type: 'checkbox',
      name: 'viewsSevenOnePattern',
      message: 'Adapted 7-1 Pattern directories:',
      choices: sevenOnePattern([
        'base',
        'pages',
        'themes',
        'vendors',
      ]),
      when: answers => answers.views === 'pug',
      pageSize: sevenOnePattern().length,
    },
    {
      type: 'number',
      name: 'port',
      message: 'Port:',
      default: await getPort(),
      validate: answer => Number.isInteger(answer) && answer > 1024 && answer < 65_535 ? true : 'Must be an available port number between 1024 and 65535.',
      filter: answer => Number.isInteger(answer) && answer > 1024 && answer < 65_535 ? answer : '',
      when: answers => answers.views === 'php',
    },
  ])
    .then(answers => {
      const defaults = {
        viewsTask: undefined,
        views: undefined,
        viewsSevenOnePattern: [],
        port: undefined,
      };

      if (answers.views) {
        defaults.viewsTask = true;
      }

      return Object.assign(defaults, answers);
    });



/*
 * =============================================================================
 * Dependencies
 * =============================================================================
 */

const dependencies = generator => {
  const dependencies = [
    'gulp',
    'gulp-notify',
    'browser-sync',
  ];

  if (generator.answers.views === 'pug') {
    dependencies.push(
      'gulp-plumber',
      'gulp-pug',
    );
  }

  return dependencies;
};



/*
 * =============================================================================
 * Files
 * =============================================================================
 */

const files = generator => {
  generator.renderTemplate('gulp/tasks/(views|browser).js', 'gulp/tasks', generator.answers);
  generator.renderTemplate(`src/views/${generator.answers.views}/index.${generator.answers.views}`, `src/views/index.${generator.answers.views}`, generator.answers);

  if (generator.answers.viewsSevenOnePattern) {
    if (generator.answers.viewsSevenOnePattern.some(directory => directory.startsWith('abstracts'))) {
      generator.renderTemplate('src/views/pug/_abstracts/index.pug', 'src/views/_abstracts/index.pug', generator.answers);
    }

    if (generator.answers.viewsSevenOnePattern.includes('abstracts/mixins')) {
      const exceptions = {
        symbols: 'symbol',
      };

      generator.copyTemplate('src/views/pug/_abstracts/mixins/**', 'src/views/_abstracts/mixins', {
        globOptions: {
          ignore: [
            `**/(${Object.values(exceptions).join('|')}).pug`,
          ],
        },
      });

      for (const [answer, filename] of Object.entries(exceptions)) {
        if (generator.answers[answer]) {
          generator.renderTemplate(`src/views/pug/_abstracts/mixins/${filename}.pug`, `src/views/_abstracts/mixins/${filename}.pug`, generator.answers);
        }
      }
    }

    const remainingDirectories = [
      'abstracts/settings',
      'abstracts/functions',
      'components',
      'layout',
    ];

    for (const directory of remainingDirectories) {
      if (generator.answers.viewsSevenOnePattern.includes(directory)) {
        generator.renderTemplate(`src/views/pug/_${directory}/**`, `src/views/_${directory}`, generator.answers);
      }
    }
  }

  if (generator.answers.type === 'website' && generator.answers.views === 'php') {
    generator.copyTemplate('_dockerignore', '.dockerignore');
    generator.renderTemplate('_docker-compose.yml', 'docker-compose.yml', generator.answers);
    generator.renderTemplate('docker/**', 'docker', generator.answers);
  }
};



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

export {
  prompts,
  dependencies,
  files,
};
