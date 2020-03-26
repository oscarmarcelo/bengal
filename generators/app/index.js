const {join} = require('path');

const Generator = require('yeoman-generator');
const slugify = require('slugify');
const license = require('generator-license');
const chalk = require('chalk');
const figures = require('figures');
const getPort = require('get-port');
const {sync: rmSync} = require('rimraf');

const utils = require('./utils');


module.exports = class extends Generator {
  initializing() {
    this.log(utils.say(
      chalk.red(`Welcome to ${chalk.yellow.bold('Bengal')}!`) + '\n\n' +
      'Let me start by asking a few questions about your project.'
    ));
  }


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
        name: 'project',
        message: 'Project Name:',
        default: this.appname.replace(/(?:^|\s)\S/g, match => match.toUpperCase()),
        validate: answer => answer.length > 0 ? true : 'Project Name is required!'
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
      },
      {
        type: 'checkbox',
        name: 'sevenOnePattern',
        message: '7-1 Pattern directories:',
        choices: [
          {
            type: 'separator',
            line: `${figures.circleFilled} ${chalk.reset('Abstracts')} ${chalk.dim('(Added if there are nested folders selected)')}`
          },
          {
            name: '├ Settings',
            value: 'abstracts/settings',
            short: 'Abstracts/Settings',
            checked: true
          },
          {
            name: '├ Functions',
            value: 'abstracts/functions',
            short: 'Abstracts/Functions',
            checked: true
          },
          {
            name: '└ Mixins',
            value: 'abstracts/mixins',
            short: 'Abstracts/Mixins',
            checked: true
          },
          {
            name: 'Base',
            value: 'base',
            checked: true
          },
          {
            name: 'Components',
            value: 'components',
            checked: true
          },
          {
            name: 'Layout',
            value: 'layout',
            checked: true
          },
          {
            name: 'Pages',
            value: 'pages'
          },
          {
            name: 'Themes',
            value: 'themes'
          },
          {
            name: 'Vendors',
            value: 'vendors'
          }
        ],
        when: answers => answers.sass,
        pageSize: 10
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
        message: 'Should symbols overflow viewbox?',
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

    this.log(
      '\n' +
      utils.say(
        chalk.green('All questions asked!') + '\n\n' +
        'Preparing files now.'
      ) +
      '\n'
    );
  }


  configuring() {
    this.composeWith(require.resolve('generator-license'), {
      name: this.answers.author,
      email: this.answers.email,
      website: this.answers.website,
      year: this.answers.year,
      license: this.answers.license
    });
  }


  writing() {
    this.sourceRoot(join(__dirname, '../../templates'));

    this.fs.copy(
      this.templatePath('_editorconfig'),
      this.destinationPath('.editorconfig')
    );

    this.fs.copyTpl(
      this.templatePath('_gitignore'),
      this.destinationPath('.gitignore'),
      this.answers
    );

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      this.answers
    );

    this.fs.copyTpl(
      this.templatePath('gulpfile.esm.js/(index|config).js'),
      this.destinationPath('gulpfile.esm.js'),
      this.answers
    );

    this.fs.copyTpl(
      this.templatePath('gulpfile.esm.js/tasks/(styles|views|copy|browser|watch).js'),
      this.destinationPath('gulpfile.esm.js/tasks'),
      this.answers
    );

    if (this.answers.sass || this.answers.symbols) {
      this.fs.copyTpl(
        this.templatePath('gulpfile.esm.js/utils.js'),
        this.destinationPath('gulpfile.esm.js/utils.js'),
        this.answers
      );
    }

    if (this.answers.symbols) {
      this.fs.copyTpl(
        this.templatePath('gulpfile.esm.js/tasks/symbols.js'),
        this.destinationPath('gulpfile.esm.js/tasks/symbols.js'),
        this.answers
      );
    }

    if (this.answers.images) {
      this.fs.copyTpl(
        this.templatePath('gulpfile.esm.js/tasks/images.js'),
        this.destinationPath('gulpfile.esm.js/tasks/images.js'),
        this.answers
      );
    }

    if (this.answers.fonts) {
      this.fs.copyTpl(
        this.templatePath('gulpfile.esm.js/tasks/fonts.js'),
        this.destinationPath('gulpfile.esm.js/tasks/fonts.js'),
        this.answers
      );
    }

    if (this.answers.scripts) {
      this.fs.copyTpl(
        this.templatePath('gulpfile.esm.js/tasks/scripts.js'),
        this.destinationPath('gulpfile.esm.js/tasks/scripts.js'),
        this.answers
      );
    }

    if (this.answers.type === 'website') {
      this.fs.copy(
        this.templatePath('gulpfile.esm.js/tasks/deploy.js'),
        this.destinationPath('gulpfile.esm.js/tasks/deploy.js')
      );

      if (this.answers.robots === false) {
        this.fs.copy(
          this.templatePath('src/robots.txt'),
          this.destinationPath('src/robots.txt')
        );
      }

      if (this.answers.views === 'php') {
        this.fs.copy(
          this.templatePath('_dockerignore'),
          this.destinationPath('.dockerignore')
        );

        this.fs.copyTpl(
          this.templatePath('_docker-compose.yml'),
          this.destinationPath('docker-compose.yml'),
          this.answers
        );

        this.fs.copyTpl(
          this.templatePath('docker/**/*'),
          this.destinationPath('docker'),
          this.answers
        );
      }

      this.fs.copy(
        this.templatePath('_env.template'),
        this.destinationPath('.env.template')
      );

      if (this.answers.serverHost && this.answers.serverUser && this.answers.serverPath) {
        this.fs.copyTpl(
          this.templatePath('_env'),
          this.destinationPath('.env'),
          this.answers
        );
      }
    }

    if (this.answers.sass) {
      this.fs.copyTpl(
        this.templatePath('src/styles/main.sass'),
        this.destinationPath('src/styles/main.sass'),
        this.answers
      );

      if (this.answers.sevenOnePattern) {
        if (this.answers.sevenOnePattern.includes('abstracts/settings') || this.answers.sevenOnePattern.includes('abstracts/functions') || this.answers.sevenOnePattern.includes('abstracts/mixins')) {
          this.fs.copyTpl(
            this.templatePath('src/styles/abstracts/_index.sass'),
            this.destinationPath('src/styles/abstracts/_index.sass'),
            this.answers
          );
        }

        if (this.answers.sevenOnePattern.includes('abstracts/settings')) {
          this.fs.copy(
            this.templatePath('src/styles/abstracts/settings/_index.scss'),
            this.destinationPath('src/styles/abstracts/settings/_index.scss')
          );

          if (this.answers.sevenOnePattern.includes('base')) {
            this.fs.copy(
              this.templatePath('src/styles/abstracts/settings/_base.scss'),
              this.destinationPath('src/styles/abstracts/settings/_base.scss')
            );
          }

          if (this.answers.sevenOnePattern.includes('components')) {
            this.fs.copy(
              this.templatePath('src/styles/abstracts/settings/_components.scss'),
              this.destinationPath('src/styles/abstracts/settings/_components.scss')
            );
          }
        }

        if (this.answers.sevenOnePattern.includes('abstracts/functions')) {
          this.fs.copy(
            this.templatePath('src/styles/abstracts/functions/**/*'),
            this.destinationPath('src/styles/abstracts/functions')
          );
        }

        if (this.answers.sevenOnePattern.includes('abstracts/mixins')) {
          this.fs.copy(
            this.templatePath('src/styles/abstracts/mixins/**/*'),
            this.destinationPath('src/styles/abstracts/mixins')
          );
        }

        if (this.answers.sevenOnePattern.includes('base')) {
          this.fs.copyTpl(
            [
              this.templatePath('src/styles/base/**/*'),
              '!**/base/_(svg|font-face).sass'
            ],
            this.destinationPath('src/styles/base'),
            this.answers
          );

          if (this.answers.symbols) {
            this.fs.copyTpl(
              this.templatePath('src/styles/base/_svg.sass'),
              this.destinationPath('src/styles/base/_svg.sass'),
              this.answers
            );
          }

          if (this.answers.fonts) {
            this.fs.copy(
              this.templatePath('src/styles/base/_font-face.sass'),
              this.destinationPath('src/styles/base/_font-face.sass')
            );
          }
        }

        if (this.answers.sevenOnePattern.includes('components')) {
          this.fs.copy(
            this.templatePath('src/styles/components/**/*'),
            this.destinationPath('src/styles/components')
          );
        }

        if (this.answers.sevenOnePattern.includes('layout')) {
          this.fs.copy(
            this.templatePath('src/styles/layout/**/*'),
            this.destinationPath('src/styles/layout')
          );
        }

        if (this.answers.sevenOnePattern.includes('pages')) {
          this.fs.copy(
            this.templatePath('src/styles/pages/**/*'),
            this.destinationPath('src/styles/pages')
          );
        }

        if (this.answers.sevenOnePattern.includes('themes')) {
          this.fs.copy(
            this.templatePath('src/styles/themes/**/*'),
            this.destinationPath('src/styles/themes')
          );
        }

        if (this.answers.sevenOnePattern.includes('vendors')) {
          this.fs.copy(
            this.templatePath('src/styles/vendors/**/*'),
            this.destinationPath('src/styles/vendors')
          );
        }
      }
    } else {
      this.fs.write(this.destinationPath('src/styles/main.css'), ''); // TODO: Consider having a template file instead.
    }

    if (this.answers.scripts) {
      this.fs.copy(
        this.templatePath('src/scripts/**/*'),
        this.destinationPath('src/scripts')
      );
    }

    this.fs.copyTpl(
      this.templatePath(`src/views/${this.answers.views}/**/*`),
      this.destinationPath('src/views'),
      this.answers
    );
  }


  install() {
    // Force an extra empty line between `writing` and `install` logs, for consistency.
    this.log('\n');

    const devDependencies = [
      'esm',
      'gulp',
      'gulp-notify',
      'gulp-postcss',
      'autoprefixer',
      'browser-sync',
      'cssnano'
    ];

    if (this.answers.sass || this.answers.symbols) {
      devDependencies.push('slash');
    }

    if (this.answers.symbols || this.answers.images || this.answers.scripts || this.answers.views === 'pug') {
      devDependencies.push('gulp-plumber');
    }

    if (this.answers.sass) {
      devDependencies.push('gulp-sass', 'gulp-rename');
    }

    if (this.answers.symbols || this.answers.images) {
      devDependencies.push('gulp-imagemin');
    }

    if (this.answers.symbols) {
      devDependencies.push('gulp-svg-sprite', 'merge-stream', 'walk-sync');
    }

    if (this.answers.overflow) {
      devDependencies.push('gulp-cheerio');
    }

    if (this.answers.scripts) {
      devDependencies.push('gulp-uglify-es');
    }

    if (this.answers.babel) {
      devDependencies.push('@babel/core', '@babel/preset-env', 'gulp-babel');
    }

    if (this.answers.views === 'pug') {
      devDependencies.push('gulp-pug');
    }

    if (this.answers.type === 'website') {
      devDependencies.push('dotenv', 'gulp-rsync');
    }

    if (this.answers.xo) {
      devDependencies.push('xo');
    }

    this.npmInstall(devDependencies, {
      'save-dev': true
    });
  }


  end() {
    // Remove Yeoman Storage file. Not needed for the project.
    rmSync(this.destinationPath('.yo-rc.json'));

    // Remove placeholder files used to create directories.
    rmSync(this.destinationPath('src/**/_placeholder'));

    // Create a Git repository.
    this.spawnCommandSync('git', ['init', '--quiet']);

    this.log(utils.say(
      chalk.green('Configuration is ready!') + '\n\n' +
      'You can start by committing these newly added files.\n\n' +
      chalk.yellow(' Good work! ') // FIXME: Spacings is for a workaround of an issue on chalk not coloring X letters when `\n` is present X+1 times before them.
    ));
  }
};
