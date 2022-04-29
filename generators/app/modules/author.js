import {validateUrl} from '../utils.js';



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
      filter: answer => answer.trim(),
    },
    {
      name: 'username',
      message: 'GitHub Username:',
      store: true,
      validate: answer => answer.length > 0 ? true : 'GitHub Username is required!',
      filter: answer => answer.trim(),
    },
    {
      name: 'email',
      message: 'Email:',
      default: generator.user.git.email(),
      filter: answer => answer.trim(),
    },
    {
      name: 'website',
      message: 'Website:',
      store: true,
      validate: validateUrl,
      filter: answer => answer.trim(),
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
