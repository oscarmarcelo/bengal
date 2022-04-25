import chalk from 'chalk';
import yosay from 'yosay';
import figures from 'figures';



const counters = {
  h1: 0,
  h2: 0,
};



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



export const sevenOnePattern = (exclude = []) => {
  const choices = [
    {
      type: 'separator',
      line: `${figures.circleFilled} ${chalk.reset('Abstracts')} ${chalk.dim('(Added if there are nested folders selected)')}`,
    },
    {
      name: '├ Settings',
      value: 'abstracts/settings',
      short: 'Abstracts/Settings',
      checked: true,
    },
    {
      name: '├ Functions',
      value: 'abstracts/functions',
      short: 'Abstracts/Functions',
      checked: true,
    },
    {
      name: '└ Mixins',
      value: 'abstracts/mixins',
      short: 'Abstracts/Mixins',
      checked: true,
    },
    {
      name: 'Base',
      value: 'base',
      checked: true,
    },
    {
      name: 'Components',
      value: 'components',
      checked: true,
    },
    {
      name: 'Layout',
      value: 'layout',
      checked: true,
    },
    {
      name: 'Pages',
      value: 'pages',
    },
    {
      name: 'Themes',
      value: 'themes',
    },
    {
      name: 'Vendors',
      value: 'vendors',
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
