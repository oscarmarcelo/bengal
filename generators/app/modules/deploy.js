/*
 * =============================================================================
 * Prompts
 * =============================================================================
 */

const prompts = generator =>
  generator.prompt([
    {
      name: 'serverHost',
      message: 'Server Host:',
      store: true,
    },
    {
      name: 'serverUser',
      message: 'Server Username:',
      store: true,
    },
    {
      name: 'serverPath',
      message: 'Server Path:',
      default() {
        let directory;

        try {
          const url = new URL(generator.answers.homepage);
          directory = url.hostname + (url.pathname === '/' ? '' : url.pathname);
        } catch {
          directory = generator.answers.package;
        }

        return `/var/www/${directory}`;
      },
    },
  ]);



/*
 * =============================================================================
 * Dependencies
 * =============================================================================
 */

const dependencies = () => {
  const dependencies = [
    'dotenv',
    'gulp',
    'gulp-rsync',
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
  generator.copyTemplate('gulp/tasks/deploy.js', 'gulp/tasks/deploy.js');
  generator.copyTemplate('_env.template', '.env.template');

  if (generator.answers.serverHost && generator.answers.serverUser && generator.answers.serverPath) {
    generator.renderTemplate('_env', '.env', generator.answers);
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
