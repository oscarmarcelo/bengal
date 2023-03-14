import {validate as validateEmail} from 'email-validator';

import {validateUrl, isPrivateEmail} from '../utilities.js';



/*
 * =============================================================================
 * Prompts
 * =============================================================================
 */

const prompts = (generator, defaults) =>
  generator.prompt([
    {
      name: 'author',
      message: 'Author:',
      default: defaults.author,
      store: true,
      validate: answer => answer.length > 0 ? true : 'Author name is required!',
      filter: answer => answer.trim(),
    },
    {
      name: 'username',
      message: 'GitHub Username:',
      default: defaults.username,
      store: true,
      validate: answer => answer.length > 0 ? true : 'GitHub Username is required!',
      filter: answer => answer.trim(),
    },
    {
      name: 'email',
      message: 'Email:',
      default: defaults.email,
      store: true,
      validate: answer => answer.length === 0 || validateEmail(answer) ? true : 'Must be a valid email address!',
      filter: answer => answer.trim(),
    },
    {
      name: 'website',
      message: 'Website:',
      store: true,
      validate: validateUrl,
      filter: answer => answer.trim(),
    },
  ])
    .then(answers => ({
      ...answers,
      privateEmail: isPrivateEmail(answers.email),
    }));



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

export {
  prompts,
};
