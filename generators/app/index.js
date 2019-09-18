const Generator = require('yeoman-generator');
const slugify = require('slugify');
const license = require('generator-license');
const chalk = require('chalk');
const getPort = require('get-port');

const utils = require('./utils');


module.exports = class extends Generator {
  async prompting() {
    this.answers = {};

    this.log(utils.h1('Project', true));

    Object.assign(this.answers, await this.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Type of Project:',
        choices: [
          {
            name: 'Website',
            value: 'website'
          },
          {
            name: 'Electron App',
            value: 'electron',
            disabled: 'Coming Soon' // TODO: Implement Electron flow.
          }
        ]
      },
      {
        name: 'package',
        message: 'Package Name:',
        default: slugify(this.appname),
        validate: answer => answer.length > 0 ? true : 'Package Name is required!'
      },
      {
        name: 'description',
        message: 'Description:'
      },
      {
        name: 'version',
        message: 'Version:',
        default: '1.0.0'
      },
      {
        name: 'homepage',
        message: 'Homepage:'
      },
      {
        type: 'confirm',
        name: 'private',
        message: 'Private:'
      }
    ]));

    this.log(utils.h1('Author'));

    Object.assign(this.answers, await this.prompt([
      {
        name: 'author',
        message: 'Author:',
        default: this.user.git.name(),
        validate: answer => answer.length > 0 ? true : 'Author name is required!'
      },
      {
        name: 'username',
        message: 'GitHub Username:',
        store: true,
        validate: answer => answer.length > 0 ? true : 'GitHub Username is required!'
      },
      {
        name: 'email',
        message: 'Email:',
        default: this.user.git.email()
      },
      {
        name: 'website',
        message: 'Website:',
        store: true
      }
    ]));

    this.log(utils.h1('License'));

    Object.assign(this.answers, await this.prompt([
      {
        type: 'list',
        name: 'license',
        message: 'License:',
        default: 'ISC',
        choices: license.licenses,
        pageSize: license.licenses.length
      },
      {
        name: 'year',
        message: 'Year(s):',
        default: new Date().getFullYear()
      }
    ]));

    this.log(utils.h1('Tasks'));

    this.log(utils.h2('Styles', true));

    Object.assign(this.answers, await this.prompt([
      {
        type: 'confirm',
        name: 'sass',
        message: 'Use Sass?'
      }
    ]));

    this.log(utils.h2('SVG Symbols'));

    Object.assign(this.answers, await this.prompt([
      {
        type: 'confirm',
        name: 'symbols',
        message: 'Use Symbols task?'
      },
      {
        type: 'confirm',
        name: 'overflow',
        message: 'Do symbols overflow viewbox?',
        when: answers => answers.symbols
      },
      {
        name: 'defaultSymbol',
        message: 'Name of default symbols file:',
        default: 'symbols',
        transformer: answer => chalk.cyan(answer) + chalk.dim('.svg'),
        when: answers => answers.symbols
      }
    ]));

    this.log(utils.h2('Images'));

    Object.assign(this.answers, await this.prompt([
      {
        type: 'confirm',
        name: 'images',
        message: 'Use Images task?'
      }
    ]));

    this.log(utils.h2('Fonts'));

    Object.assign(this.answers, await this.prompt([
      {
        type: 'confirm',
        name: 'fonts',
        message: 'Use Fonts task?'
      }
    ]));

    this.log(utils.h2('Scripts'));

    Object.assign(this.answers, await this.prompt([
      {
        type: 'confirm',
        name: 'scripts',
        message: 'Use Scripts task?'
      },
      {
        type: 'confirm',
        name: 'babel',
        message: 'Use Babel?',
        when: answers => answers.scripts
      },
      {
        type: 'confirm',
        name: 'xo',
        message: 'Use XO?',
        when: answers => answers.scripts
      }
    ]));

    this.log(utils.h2('Views'));

    Object.assign(this.answers, await this.prompt([
      {
        type: 'list',
        name: 'views',
        message: 'Language:',
        choices: [
          {
            name: 'Pug',
            value: 'pug'
          },
          {
            name: 'PHP',
            value: 'php'
          }
        ]
      },
      {
        type: 'number',
        name: 'port',
        message: 'Port:',
        default: await getPort(),
        validate: answer => Number.isInteger(answer) && answer > 1024 && answer < 65535 ? true : 'Must be an available port number between 1024 and 65535.',
        filter: answer => Number.isInteger(answer) && answer > 1024 && answer < 65535 ? answer : '',
        when: answers => answers.views === 'php'
      }
    ]));

    this.log(utils.h2('Miscellaneous Static Files'));

    Object.assign(this.answers, await this.prompt([
      {
        type: 'confirm',
        name: 'misc',
        message: 'Use Misc task?'
      }
    ]));

    if (this.answers.type === 'website') {
      Object.assign(this.answers, await this.prompt([
        {
          type: 'confirm',
          name: 'robots',
          message: 'Allow Robots?'
        }
      ]));
    }

    this.log(utils.h2('Deploy'));

    if (this.answers.type === 'website') {
      Object.assign(this.answers, await this.prompt([
        {
          name: 'serverHost',
          message: 'Server Host:'
        },
        {
          name: 'serverUser',
          message: 'Server Username:'
        },
        {
          name: 'serverPath',
          message: 'Server Path:'
        }
      ]));
    }
  }

};
