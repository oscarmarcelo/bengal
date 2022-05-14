import {version} from 'node:process';

import slugify from '@sindresorhus/slugify';
import validatePackageName from 'validate-npm-package-name';
import chalk from 'chalk';
import semver from 'semver';

import {parseList, validateUrl, error} from '../utils.js';



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

            messages[index] = `${message}.`;
          }

          return error(messages);
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
          answer = parseList(answer)
            .map(keyword => chalk.cyan(keyword))
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
  ])
    .then(answers => {
      const scopedPackageRegex = /^(?:@([^/]+?)\/)?([^/]+?)$/;
      const match = answers.package.match(scopedPackageRegex);
      const scope = match?.[1];
      const unscopedPackage = match?.[2];

      let camelCasePackage = unscopedPackage || answers.package;

      if (camelCasePackage.endsWith('.js')) {
        camelCasePackage = camelCasePackage.slice(0, -3);
      }

      camelCasePackage = camelCasePackage
        .replace(/[-_\s]+(.)?/g, (_, letter) => letter ? letter.toUpperCase() : '');

      camelCasePackage = camelCasePackage.charAt(0).toLowerCase() + camelCasePackage.slice(1);

      const minNodeVersion = '14.16';
      const currentNodeVersion = semver.coerce(version);

      const nodeVersion = semver.gt(currentNodeVersion.version, semver.coerce(minNodeVersion).version)
        ? currentNodeVersion.major + (currentNodeVersion.minor > 0 ? `.${currentNodeVersion.minor}` : '')
        : minNodeVersion;

      return Object.assign(answers, {
        scope,
        unscopedPackage,
        camelCasePackage,
        nodeVersion,
      });
    });



/*
 * =============================================================================
 * Configuration
 * =============================================================================
 */

const configuration = generator => {
  generator.answers.keywords = JSON.stringify(parseList(generator.answers.keywords));
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
