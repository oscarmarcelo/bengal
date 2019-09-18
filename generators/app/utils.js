const chalk = require('chalk');

const counters = {
  h1: 0,
  h2: 0
};


module.exports.h1 = (text, hideMarginTop) => {
  counters.h1++;
  counters.h2 = 0;

  return `${hideMarginTop ? '' : '\n'}\n` +
  `  ${chalk.red(counters.h1)}${chalk.dim('.')} ${chalk.yellowBright.bold(text)}\n` +
  chalk.yellow.dim('════════════════════════════════════════════════════════');
};


module.exports.h2 = (text, hideMarginTop) => {
  counters.h2++;

  return `${hideMarginTop ? '' : '\n'}\n` +
  `  ${chalk.red(counters.h1 + '.' + counters.h2)}${chalk.dim('.')} ${chalk.yellowBright.bold(text)}\n` +
  chalk.yellow.dim('────────────────────────────────────────');
};
