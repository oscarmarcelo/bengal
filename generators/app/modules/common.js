/*
 * =============================================================================
 * Dependencies
 * =============================================================================
 */

const dependencies = generator => {
  const dependencies = [
    'gulp',
    'del',
    'gulp-notify',
  ];

  if (generator.answers.styles || generator.answers.scripts) {
    dependencies.push(
      'merge-stream',
      'gulp-rename',
    );
  }

  if (generator.answers.styles || generator.answers.symbols || generator.answers.scripts) {
    dependencies.push(
      'slash',
    );
  }

  if (generator.answers.symbols) {
    dependencies.push(
      'walk-sync',
    );
  }

  if (generator.answers.type === 'package') {
    dependencies.push(
      'np',
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
  generator.copyTemplate('_vscode', '.vscode');
  generator.copyTemplate('_editorconfig', '.editorconfig');
  generator.renderTemplate('_gitignore', '.gitignore', generator.answers);
  generator.renderTemplate('README.md', 'README.md', generator.answers);
  generator.renderTemplate('_nvmrc', '.nvmrc', generator.answers);
  generator.renderTemplate('_package.json', 'package.json', generator.answers);

  generator.renderTemplate('gulpfile.js', 'gulpfile.js', generator.answers);
  generator.renderTemplate('gulp/(index|config).js', 'gulp', generator.answers);
  generator.renderTemplate('gulp/tasks/(copy|watch|clean).js', 'gulp/tasks', generator.answers);

  if (generator.answers.styles || generator.answers.symbols || generator.answers.scripts) {
    generator.renderTemplate('gulp/utilities.js', 'gulp/utilities.js', generator.answers);
  }

  generator.copyTemplate('src/_placeholder', 'src/_placeholder');
};



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

export {
  dependencies,
  files,
};
