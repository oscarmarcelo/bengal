import slugify from '@sindresorhus/slugify';
import validatePackageName from 'validate-npm-package-name';
import chalk from 'chalk';



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
    },
    {
      name: 'description',
      message: 'Description:',
    },
    {
      name: 'version',
      message: 'Version:',
      default: '1.0.0',
    },
    {
      name: 'homepage',
      message: 'Homepage:',
      validate(answer) {
        try {
          return Boolean(answer.trim() === '' || new URL(answer));
        } catch {
          return 'URL is not valid!';
        }
      },
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
