/*
 * =============================================================================
 * Prompts
 * =============================================================================
 */

const prompts = generator =>
  generator.prompt([
    {
      name: 'author',
      message: 'Author:',
      default: generator.user.git.name(),
      validate: answer => answer.length > 0 ? true : 'Author name is required!',
    },
    {
      name: 'username',
      message: 'GitHub Username:',
      store: true,
      validate: answer => answer.length > 0 ? true : 'GitHub Username is required!',
    },
    {
      name: 'email',
      message: 'Email:',
      default: generator.user.git.email(),
    },
    {
      name: 'website',
      message: 'Website:',
      store: true,
    },
  ]);



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

export {
  prompts,
};
