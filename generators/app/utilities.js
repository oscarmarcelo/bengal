import {createServer} from 'node:net';

import chalk from 'chalk';
import yosay from 'yosay';
import figures from 'figures';



const counters = {
  h1: 0,
  h2: 0,
};
const {circleFilled, lineUpDownRight, lineUpRight} = figures;



export const h1 = (text, hideMarginTop) => {
  counters.h1++;
  counters.h2 = 0;

  return `${hideMarginTop ? '' : '\n'}\n`
  + `  ${chalk.red(counters.h1)}${chalk.dim('.')} ${chalk.yellowBright.bold(text)}\n`
  + chalk.yellow.dim('═'.repeat(56));
};



export const h2 = (text, hideMarginTop) => {
  counters.h2++;

  return `${hideMarginTop ? '' : '\n'}\n`
  + `  ${chalk.red(counters.h1 + '.' + counters.h2)}${chalk.dim('.')} ${chalk.yellowBright.bold(text)}\n`
  + chalk.yellow.dim('─'.repeat(40));
};



export const say = text =>
  yosay(text, {
    maxLength: 35,
  });



export const parseList = list => {
  list = list
    .split(/[,\r\n\f]+/)
    .map(item => item.replaceAll(/\s+/g, ' ').trim())
    .filter(item => item.length > 0)
    .sort();

  return [...new Set(list)];
};



export const validateUrl = answer => {
  try {
    return Boolean(answer.trim() === '' || new URL(answer));
  } catch {
    const hasProtocol = /^(?:\w+:)?\/\//i.test(answer);

    return `Invalid URL!${hasProtocol === false ? ' Protocol is missing.' : ''}`;
  }
};



export const architecture = (exclude = []) => {
  const choices = [
    {
      type: 'separator',
      line: `${circleFilled} ${chalk.reset('Abstracts')} ${chalk.dim('(Added if there are nested folders selected)')}`,
    },
    {
      name: `${chalk.white.dim(lineUpDownRight)} Settings`,
      value: 'abstracts/settings',
      short: '\n  Abstracts/Settings',
      checked: true,
    },
    {
      name: `${chalk.white.dim(lineUpDownRight)} Functions`,
      value: 'abstracts/functions',
      short: '\n  Abstracts/Functions',
      checked: true,
    },
    {
      name: `${chalk.white.dim(lineUpRight)} Mixins`,
      value: 'abstracts/mixins',
      short: '\n  Abstracts/Mixins',
      checked: true,
    },
    {
      name: 'Base',
      value: 'base',
      short: '\n  Base',
      checked: true,
    },
    {
      name: 'Components',
      value: 'components',
      short: '\n  Components',
      checked: true,
    },
    {
      name: 'Layout',
      value: 'layout',
      short: '\n  Layout',
      checked: true,
    },
    {
      name: 'Overrides',
      value: 'overrides',
      short: '\n  Overrides',
      checked: true,
    },
    {
      name: 'Pages',
      value: 'pages',
      short: '\n  Pages',
    },
    {
      name: 'Themes',
      value: 'themes',
      short: '\n  Themes',
    },
    {
      name: 'Utilities',
      value: 'utilities',
      short: '\n  Utilities',
      checked: true,
    },
    {
      name: 'Vendors',
      value: 'vendors',
      short: '\n  Vendors',
    },
  ];

  for (const name of exclude) {
    const index = choices.findIndex(item => item.value === name);

    if (index > -1) {
      choices.splice(index, 1);
    }
  }

  return choices;
};



export const checkAvailablePort = options =>
  new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on('error', reject);

    server.listen(options, () => {
      const {port} = server.address();
      server.close(() => {
        resolve(port);
      });
    });
  });



export const error = lines =>
  lines
    .map((line, index) => (index > 0 ? `${chalk.red('>>')} ` : '') + line)
    .join('\n');



export const isPrivateEmail = email =>
  /@users\.noreply\.git(hub|lab)\.com$/
    .test(email);
