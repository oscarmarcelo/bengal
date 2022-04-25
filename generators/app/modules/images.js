/*
 * =============================================================================
 * Prompts
 * =============================================================================
 */

const prompts = generator =>
  generator.prompt([
    {
      type: 'confirm',
      name: 'images',
      message: 'Use Images task?',
    },
  ]);



/*
 * =============================================================================
 * Dependencies
 * =============================================================================
 */

const dependencies = () => {
  const dependencies = [
    'gulp',
    'gulp-plumber',
    'gulp-imagemin',
    'gulp-notify',
  ];

  return dependencies;
};



/*
 * =============================================================================
 * Files
 * =============================================================================
 */

const files = generator => {
  generator.renderTemplate('gulp/tasks/images.js', 'gulp/tasks/images.js', generator.answers);
  generator.renderTemplate('src/images/**', 'src/images', generator.answers);
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
