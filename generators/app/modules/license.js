import {createRequire} from 'node:module';

import license from 'generator-license';



/*
 * =============================================================================
 * Prompts
 * =============================================================================
 */

const prompts = generator =>
  generator.prompt([
    {
      type: 'list',
      name: 'license',
      message: 'License:',
      default: 'ISC',
      choices: license.licenses,
      pageSize: license.licenses.length,
    },
    {
      name: 'year',
      message: 'Year(s):',
      default: new Date().getFullYear(),
    },
  ]);



/*
 * =============================================================================
 * Configuration
 * =============================================================================
 */

const configuration = generator => {
  generator.composeWith(createRequire(import.meta.url).resolve('generator-license'), {
    name: generator.answers.author,
    email: generator.answers.email,
    website: generator.answers.website,
    year: generator.answers.year,
    license: generator.answers.license,
  });
};



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

export {
  prompts,
  configuration,
};
