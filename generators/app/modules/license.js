import {createRequire} from 'node:module';

import license from 'generator-license';
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
      validate(answer) {
        const yearRegex = /^\d{4}$/;
        const currentYear = new Date().getFullYear();

        // Ensure that `answer` has only 4-digits numbers, spaces, commas, and hyphens.
        if (
          (typeof answer === 'number' && yearRegex.test(answer))
          || (typeof answer === 'string' && answer
            .split(/\s*[,-]\s*/)
            .every(year => yearRegex.test(year))
          )
        ) {
          return true;
        }

        const examples = [
          `${currentYear}`,
          `${currentYear - 2}-${currentYear}`,
          `${currentYear - 5}, ${currentYear - 2}, ${currentYear}`,
          `${currentYear - 5}, ${currentYear - 2}-${currentYear}`,
        ]
          .map(example => `${chalk.green(figures.tick)} ${chalk.cyan(example)}`);

        return error([
          'Must be one or more 4-digit years separated by commas (,) or hyphens (-) if there are ranges.',
          '',
          chalk.dim('Examples:'),
          ...examples,
        ]);
      },
      filter(answer) {
        if (typeof answer === 'string') {
          // Convert `answer` into a normalized and sorted array of [start, end] arrays.
          answer = answer
            .trim()
            .split(/\s*,\s*/)
            .filter(item => ['', '-'].includes(item) === false)
            .map(item => {
              item = item
                .split(/\s*-\s*/)
                .filter(year => year !== '');

              if (item.length === 1) {
                item = [
                  item[0],
                  item[0],
                ];
              } else {
                item = item.sort((a, b) => a - b);

                if (item.length > 2) {
                  item = [
                    item[0],
                    item[item.length - 1],
                  ];
                }
              }

              return item;
            })
            .sort((a, b) => a[0] - b[0] || a[1] - b[1]);

          // Merge duplicate years and overlapping ranges.
          const newAnswer = [
            answer[0],
          ];

          for (const range of answer.slice(1)) {
            const lastRange = newAnswer[newAnswer.length - 1];

            if (range[0] > lastRange[1]) {
              newAnswer.push(range);
            } else if (range[1] > lastRange[1]) {
              lastRange[1] = range[1];
            }
          }

          // Reconstruct `answer`.
          answer = newAnswer
            .map(item => item[0] === item[1] ? item[0] : item.join('-'))
            .join(', ');
        }

        return answer;
      },
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
