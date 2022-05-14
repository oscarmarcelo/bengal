import chalk from 'chalk';



/*
 * =============================================================================
 * Prompts
 * =============================================================================
 */

const prompts = generator =>
  generator.prompt([
    {
      type: 'confirm',
      name: 'symbols',
      message: 'Use Symbols task?',
    },
    {
      type: 'confirm',
      name: 'overflow',
      message: 'Should symbols overflow viewbox?',
      when: answers => answers.symbols,
    },
    {
      name: 'symbolsFile',
      message: 'Default symbols file name:',
      default: 'symbols',
      store: true,
      filter: answer => answer.trim(),
      transformer: answer => chalk.cyan(answer) + chalk.dim('.svg'),
      when: answers => answers.symbols,
    },
  ])
    .then(answers => {
      const defaults = {
        overflow: undefined,
        symbolsFile: undefined,
      };

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
    'gulp-plumber',
    'gulp-imagemin',
    'gulp-svg-sprite',
    '@sindresorhus/slugify',
    'gulp-notify',
    'merge-stream',
  ];

  if (generator.answers.overflow) {
    dependencies.push(
      'gulp-cheerio',
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
  generator.renderTemplate('gulp/tasks/symbols.js', 'gulp/tasks/symbols.js', generator.answers);
  generator.renderTemplate('src/symbols/**', 'src/symbols', generator.answers);
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
