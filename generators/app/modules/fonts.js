/*
 * =============================================================================
 * Prompts
 * =============================================================================
 */

const prompts = generator =>
  generator.prompt([
    {
      type: 'confirm',
      name: 'fonts',
      message: 'Use Fonts task?',
    },
  ]);



/*
 * =============================================================================
 * Dependencies
 * =============================================================================
 */

const dependencies = generator => {
  const dependencies = [
    'gulp',
    'gulp-notify',
  ];

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
  generator.renderTemplate('gulp/tasks/fonts.js', 'gulp/tasks/fonts.js', generator.answers);
  generator.renderTemplate('src/fonts/**', 'src/fonts', generator.answers);
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
