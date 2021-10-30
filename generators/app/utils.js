import chalk from 'chalk';
import yosay from 'yosay';



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
