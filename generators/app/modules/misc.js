/*
 * =============================================================================
 * Prompts
 * =============================================================================
 */

const prompts = generator =>
  generator.prompt([
    {
      type: 'confirm',
      name: 'robots',
      message: 'Allow Robots?',
    },
  ]);



/*
 * =============================================================================
 * Files
 * =============================================================================
 */

const files = generator => {
  if (generator.answers.robots === false) {
    generator.copyTemplate('src/robots.txt', 'src/robots.txt');
  }
};



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

export {
  prompts,
  files,
};
