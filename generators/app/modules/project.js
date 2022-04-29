import slugify from '@sindresorhus/slugify';
import validatePackageName from 'validate-npm-package-name';
import chalk from 'chalk';
import semver from 'semver';

import {validateUrl} from '../utils.js';



/*
 * =============================================================================
 * Prompts
 * =============================================================================
 */

const prompts = generator =>
  generator.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Type of Project:',
      choices: [
        {
          name: 'Website',
          value: 'website',
        },
        // {
        //   name: 'Electron App',
        //   value: 'electron',
        //   disabled: 'Coming Soon', // TODO: Implement Electron flow.
        // },
        {
          name: 'NPM Package',
          value: 'package',
        },
      ],
    },
    {
      name: 'project',
      message: 'Project Name:',
      default: generator.appname.replace(/(?:^|\s)\S/g, match => match.toUpperCase()),
      validate: answer => answer.length > 0 ? true : 'Project Name is required!',
      filter: answer => answer.trim(),
    },
    {
      name: 'package',
      message: 'Package Name:',
      default: slugify(generator.appname),
      validate(answer) {
        const validity = validatePackageName(answer);

        if (validity.validForNewPackages === false) {
          const messages = [
            ...(validity.errors || []),
            ...(validity.warnings || []),
          ];

          for (let [index, message] of messages.entries()) {
            if (message.startsWith(answer)) {
              message = `"${answer}"${message.slice(answer.length)}`;
            } else if (message.startsWith('name')) {
              message = `Package ${message}`;
            }

            if (index > 0) {
              message = `${chalk.red('>>')} ${message}`;
            }

            messages[index] = `${message}.`;
          }

          return messages.join('\n');
        }

        return true;
      },
      filter: answer => answer.trim(),
    },
    {
      name: 'description',
      message: 'Description:',
      filter: answer => answer.trim(),
    },
    {
      name: 'keywords',
      message: 'Keywords:',
      transformer(answer, _answers, options) {
        if (options.isFinal) {
          answer = answer
            .split(',')
            .map(keyword => chalk.cyan(keyword.trim()))
            .filter(keyword => keyword.length > 0);

          answer = [...new Set(answer)]
            .join(', ');
        } else {
          answer = `${chalk.reset.dim('(Use comma as separator)')}\n  ${answer}`;
        }

        return answer;
      },
    },
    {
      name: 'version',
      message: 'Version:',
      default: '1.0.0',
      validate: answer => semver.valid(answer) ? true : 'Must be a valid semantic version.',
      filter: answer => semver.clean(answer) || answer.trim(),
    },
    {
      name: 'homepage',
      message: 'Homepage:',
      validate: validateUrl,
      filter: answer => answer.trim(),
    },
  ]);



/*
 * =============================================================================
 * Configuration
 * =============================================================================
 */

const configuration = generator => {
  const keywords = generator.answers.keywords
    .split(',')
    .map(keyword => keyword.trim())
    .filter(keyword => keyword.length > 0);

  generator.answers.keywords = JSON.stringify([...new Set(keywords)]);
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
