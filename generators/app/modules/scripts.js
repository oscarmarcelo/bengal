/*
 * =============================================================================
 * Prompts
 * =============================================================================
 */

const prompts = generator =>
  generator.prompt([
    {
      type: 'confirm',
      name: 'scripts',
      message: 'Use Scripts task?',
    },
    {
      type: 'confirm',
      name: 'babel',
      message: 'Use Babel?',
      when: answers => answers.scripts,
    },
    {
      type: 'confirm',
      name: 'xo',
      message: 'Use XO?',
      when: answers => answers.scripts,
    },
  ])
    .then(answers => ({
      babel: undefined,
      xo: undefined,
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
    'gulp-plumber',
    'gulp-notify',
    'gulp-uglify-es',
  ];

  if (generator.answers.babel) {
    dependencies.push(
      'gulp-babel',
      '@babel/core',
      '@babel/preset-env',
    );
  }

  if (generator.answers.xo) {
    dependencies.push(
      'xo',
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
  generator.renderTemplate('gulp/tasks/scripts.js', 'gulp/tasks/scripts.js', generator.answers);
  generator.copyTemplate('src/scripts/**', 'src/scripts');
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
