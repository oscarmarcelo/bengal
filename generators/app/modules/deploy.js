import {isIP} from 'node:net';

import isValidHostname from 'is-valid-hostname';
import chalk from 'chalk';
import figures from 'figures';

import {error} from '../utils.js';



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
      validate: answer =>
        answer.length === 0
        || isIP(answer)
        || isValidHostname(answer)
          ? true
          : 'Must be a valid IP or DNS hostname.',
      filter: answer => answer.trim(),
    },
    {
      name: 'serverUser',
      message: 'Server Username:',
      store: true,
      validate(answer) {
        if (answer.length === 0) {
          return true;
        }

        const regex = /^[a-z_]([a-z\d_-]{0,31}|[a-z\d_-]{0,30}\$)$/;

        const rules = [
          'Must contain only letters, numbers, underscores, or hyphens;',
          'Up to 32 characters;',
          'First character must be lower case letter or underscore;',
          'Last character may be a dollar sign ($).',
        ]
          .map(example => `${chalk.green(figures.tick)} ${chalk.cyan(example)}`);

        return regex.test(answer)
          ? true
          : error([
            'Must be a valid username.',
            '',
            chalk.dim('Rules:'),
            ...rules,
          ]);
      },
      filter: answer => answer.trim(),
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
      filter: answer => answer.trim(),
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
