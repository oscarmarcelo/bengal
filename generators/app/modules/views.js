import getPort from 'get-port';

import {architecture, checkAvailablePort} from '../utils.js';



/*
 * =============================================================================
 * Prompts
 * =============================================================================
 */

const prompts = async generator =>
  generator.prompt([
    {
      type: 'confirm',
      name: 'views',
      message: 'Use Views task?',
      when: generator.answers.type === 'package',
    },
    {
      type: 'list',
      name: 'viewsLanguage',
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
        {
          name: 'HTML',
          value: 'html',
        },
      ],
      when: answers => generator.answers.type !== 'package' || answers.views,
    },
    {
      type: 'checkbox',
      name: 'viewsArchitecture',
      message: 'Architecture:',
      choices: architecture([
        'base',
        'overrides',
        'pages',
        'themes',
        'utilities',
      ]),
      when: answers => answers.viewsLanguage === 'pug',
      pageSize: architecture().length,
    },
    {
      name: 'port',
      message: 'Port:',
      default: await getPort(),
      async validate(answer) {
        const number = Number(answer);

        if (Number.isInteger(number) && number > 1024 && number < 65_535) {
          try {
            await checkAvailablePort({
              port: number,
              host: 'localhost',
            });

            return true;
          } catch ({code}) {
            return ['EADDRINUSE', 'EADDRNOTAVAIL', 'EACCES'].includes(code)
              ? `Port ${number} is unavailable.`
              : `Couldn't check if port ${number} is available. (${code})`;
          }
        }

        return 'Must be an available port number between 1024 and 65535.';
      },
      filter(answer) {
        const number = Number(answer);

        return Number.isInteger(number) && number > 1024 && number < 65_535 ? number : answer;
      },
      when: answers => answers.viewsLanguage === 'php',
    },
  ])
    .then(answers => ({
      views: answers.viewsLanguage ? true : undefined,
      viewsLanguage: undefined,
      viewsArchitecture: [],
      port: undefined,
      ...answers,
    }));



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

  if (generator.answers.viewsLanguage === 'pug') {
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
  generator.renderTemplate(`src/views/${generator.answers.viewsLanguage}/index.${generator.answers.viewsLanguage}`, `src/views/index.${generator.answers.viewsLanguage}`, generator.answers);

  if (generator.answers.viewsArchitecture) {
    if (generator.answers.viewsArchitecture.some(directory => directory.startsWith('abstracts'))) {
      generator.renderTemplate('src/views/pug/_abstracts/index.pug', 'src/views/_abstracts/index.pug', generator.answers);
    }

    if (generator.answers.viewsArchitecture.includes('abstracts/mixins')) {
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
      'vendors',
    ];

    for (const directory of remainingDirectories) {
      if (generator.answers.viewsArchitecture.includes(directory)) {
        generator.renderTemplate(`src/views/pug/_${directory}/**`, `src/views/_${directory}`, generator.answers);
      }
    }
  }

  if (generator.answers.viewsLanguage === 'php') {
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
