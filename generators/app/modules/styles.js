import {architecture} from '../utilities.js';



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
      type: 'list',
      name: 'stylesLanguage',
      message: 'Language:',
      choices: [
        {
          name: 'Sass',
          value: 'sass',
        },
        {
          name: 'CSS',
          value: 'css',
        },
      ],
      when: answers => generator.answers.type !== 'package' || answers.styles,
    },
    {
      type: 'checkbox',
      name: 'stylesArchitecture',
      message: 'Architecture:',
      choices: architecture(),
      when: answers => answers.stylesLanguage === 'sass',
      pageSize: architecture().length,
    },
  ])
    .then(answers => ({
      styles: answers.stylesLanguage ? true : undefined,
      stylesLanguage: undefined,
      stylesArchitecture: [],
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
    'gulp-postcss',
    'postcss',
    'autoprefixer',
    'cssnano',
  ];

  if (generator.answers.stylesLanguage === 'sass') {
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

  if (generator.answers.stylesLanguage === 'sass') {
    generator.renderTemplate('src/styles/sass/main.sass', 'src/styles/main.sass', generator.answers);

    if (generator.answers.stylesArchitecture.some(directory => directory.startsWith('abstracts'))) {
      generator.renderTemplate('src/styles/sass/abstracts/_index.sass', 'src/styles/abstracts/_index.sass', generator.answers);
    }

    if (generator.answers.stylesArchitecture.includes('abstracts/settings')) {
      generator.copyTemplate('src/styles/sass/abstracts/settings/_tokens.scss', 'src/styles/abstracts/settings/_tokens.scss');

      const settingsDirectories = [
        'base',
        'components',
        'layout',
        'pages',
        'themes',
      ];

      for (const directory of settingsDirectories) {
        if (generator.answers.stylesArchitecture.includes(directory)) {
          generator.copyTemplate(`src/styles/sass/abstracts/settings/${directory}/**`, `src/styles/abstracts/settings/${directory}`);
        }
      }
    }

    if (generator.answers.stylesArchitecture.includes('base')) {
      const exceptions = {
        symbols: 'svg',
        fonts: 'font-face',
      };

      generator.renderTemplate(`src/styles/sass/base/**/_!(${Object.values(exceptions).join('|')}).sass`, 'src/styles/base', generator.answers);

      for (const [answer, filename] of Object.entries(exceptions)) {
        if (generator.answers[answer]) {
          generator.renderTemplate(`src/styles/sass/base/_${filename}.sass`, `src/styles/base/_${filename}.sass`, generator.answers);
        }
      }
    }

    if (generator.answers.stylesArchitecture.includes('overrides')) {
      const overridesDirectories = [
        'base',
        'components',
        'layout',
      ];

      for (const directory of overridesDirectories) {
        if (generator.answers.stylesArchitecture.includes(directory)) {
          generator.copyTemplate(`src/styles/sass/overrides/${directory}/**`, `src/styles/overrides/${directory}`);
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
      'utilities',
      'vendors',
    ];

    for (const directory of remainingDirectories) {
      if (generator.answers.stylesArchitecture.includes(directory)) {
        generator.copyTemplate(`src/styles/sass/${directory}/**`, `src/styles/${directory}`);
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
