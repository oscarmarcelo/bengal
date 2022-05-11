import {sevenOnePattern} from '../utils.js';



/*
 * =============================================================================
 * Prompts
 * =============================================================================
 */

const prompts = generator =>
  generator.prompt([
    {
      type: 'confirm',
      name: 'styles',
      message: 'Use Styles task?',
      when: generator.answers.type === 'package',
    },
    {
      type: 'confirm',
      name: 'sass',
      message: 'Use Sass?',
      when: answers => generator.answers.type !== 'package' || answers.styles,
    },
    {
      type: 'checkbox',
      name: 'sevenOnePattern',
      message: '7-1 Pattern directories:',
      choices: sevenOnePattern(),
      when: answers => answers.sass,
      pageSize: sevenOnePattern().length,
    },
  ])
    .then(answers => {
      const defaults = {
        styles: undefined,
        sass: undefined,
        maro: undefined,
        sevenOnePattern: [],
      };

      if (answers.sass) {
        defaults.styles = true;
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
    'gulp-postcss',
    'postcss',
    'autoprefixer',
    'cssnano',
  ];

  if (generator.answers.sass) {
    dependencies.push(
      'gulp-sass',
      'sass',
      'gulp-rename',
    );
  }

  if (generator.answers.views) {
    dependencies.push(
      'browser-sync',
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
  generator.renderTemplate('gulp/tasks/styles.js', 'gulp/tasks/styles.js', generator.answers);

  if (generator.answers.sass) {
    generator.renderTemplate('src/styles/sass/main.sass', 'src/styles/main.sass', generator.answers);

    if (generator.answers.sevenOnePattern) {
      if (generator.answers.sevenOnePattern.some(directory => directory.startsWith('abstracts'))) {
        generator.renderTemplate('src/styles/sass/abstracts/_index.sass', 'src/styles/abstracts/_index.sass', generator.answers);
      }

      if (generator.answers.sevenOnePattern.includes('abstracts/settings')) {
        generator.copyTemplate('src/styles/sass/abstracts/settings/_tokens.scss', 'src/styles/abstracts/settings/_tokens.scss');

        const settingsDirectories = [
          'base',
          'components',
          'layout',
          'pages',
          'themes',
        ];

        for (const directory of settingsDirectories) {
          // eslint-disable-next-line max-depth
          if (generator.answers.sevenOnePattern.includes(directory)) {
            generator.copyTemplate(`src/styles/sass/abstracts/settings/${directory}/**`, `src/styles/abstracts/settings/${directory}`);
          }
        }
      }

      if (generator.answers.sevenOnePattern.includes('base')) {
        const exceptions = {
          symbols: 'svg',
          fonts: 'font-face',
        };

        generator.renderTemplate(`src/styles/sass/base/**/_!(${Object.values(exceptions).join('|')}).sass`, 'src/styles/base', generator.answers);

        for (const [answer, filename] of Object.entries(exceptions)) {
          // eslint-disable-next-line max-depth
          if (generator.answers[answer]) {
            generator.renderTemplate(`src/styles/sass/base/_${filename}.sass`, `src/styles/base/_${filename}.sass`, generator.answers);
          }
        }
      }

      const remainingDirectories = [
        'abstracts/functions',
        'abstracts/mixins',
        'components',
        'layout',
        'pages',
        'themes',
        'vendors',
      ];

      for (const directory of remainingDirectories) {
        if (generator.answers.sevenOnePattern.includes(directory)) {
          generator.copyTemplate(`src/styles/sass/${directory}/**`, `src/styles/${directory}`);
        }
      }
    }
  } else {
    generator.renderTemplate('src/styles/css/main.css', 'src/styles/main.css', generator.answers);
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
