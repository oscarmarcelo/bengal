import {join} from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

import Generator from 'yeoman-generator';
import slugify from '@sindresorhus/slugify';
import license from 'generator-license';
import chalk from 'chalk';
import figures from 'figures';
import getPort from 'get-port';
import rimraf from 'rimraf';

import * as utils from './utils.js';



const {sync: rmSync} = rimraf;



export default class Bengal extends Generator {
  initializing() {
    this.log(utils.say(
      chalk.red(`Welcome to ${chalk.yellow.bold('Bengal')}!`) + '\n\n'
      + 'Let me start by asking a few questions about your project.',
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
            value: 'website',
          },
          {
            name: 'Electron App',
            value: 'electron',
            disabled: 'Coming Soon', // TODO: Implement Electron flow.
          },
          {
            name: 'NPM Package',
            value: 'package',
          },
        ],
      },
      {
        name: 'project',
        message: 'Project Name:',
        default: this.appname.replace(/(?:^|\s)\S/g, match => match.toUpperCase()),
        validate: answer => answer.length > 0 ? true : 'Project Name is required!',
      },
      {
        name: 'package',
        message: 'Package Name:',
        default: slugify(this.appname),
        validate: answer => answer.length > 0 ? true : 'Package Name is required!',
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
        validate: answer => {
          try {
            return Boolean(answer.trim() === '' || new URL(answer));
          } catch {
            return 'URL is not valid!';
          }
        },
        filter: answer => answer.trim(),
      },
    ]));

    this.log(utils.h1('Author'));

    Object.assign(this.answers, await this.prompt([
      {
        name: 'author',
        message: 'Author:',
        default: this.user.git.name(),
        validate: answer => answer.length > 0 ? true : 'Author name is required!',
      },
      {
        name: 'username',
        message: 'GitHub Username:',
        store: true,
        validate: answer => answer.length > 0 ? true : 'GitHub Username is required!',
      },
      {
        name: 'email',
        message: 'Email:',
        default: this.user.git.email(),
      },
      {
        name: 'website',
        message: 'Website:',
        store: true,
      },
    ]));

    this.log(utils.h1('License'));

    Object.assign(this.answers, await this.prompt([
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
      },
    ]));

    this.log(utils.h1('Tasks'));

    this.log(utils.h2('Styles', true));

    Object.assign(this.answers, {
      styles: undefined,
      sass: undefined,
      maro: undefined,
      sevenOnePattern: undefined,
    }, await this.prompt([
      {
        type: 'confirm',
        name: 'styles',
        message: 'Use Styles task?',
        when: this.answers.type === 'package',
      },
      {
        type: 'confirm',
        name: 'sass',
        message: 'Use Sass?',
        when: answers => this.answers.type !== 'package' || answers.styles,
      },
      {
        type: 'checkbox',
        name: 'sevenOnePattern',
        message: '7-1 Pattern directories:',
        choices: [
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
        ],
        when: answers => answers.sass,
        pageSize: 10,
      },
    ]));

    this.log(utils.h2('SVG Symbols'));

    Object.assign(this.answers, {
      overflow: undefined,
      defaultSymbol: undefined,
    }, await this.prompt([
      {
        type: 'confirm',
        name: 'symbols',
        message: 'Use Symbols task?',
      },
      {
        type: 'confirm',
        name: 'overflow',
        message: 'Should symbols overflow viewbox?',
        when: answers => answers.symbols,
      },
      {
        name: 'defaultSymbol',
        message: 'Name of default symbols file:',
        default: 'symbols',
        transformer: answer => chalk.cyan(answer) + chalk.dim('.svg'),
        when: answers => answers.symbols,
      },
    ]));

    this.log(utils.h2('Images'));

    Object.assign(this.answers, await this.prompt([
      {
        type: 'confirm',
        name: 'images',
        message: 'Use Images task?',
      },
    ]));

    this.log(utils.h2('Fonts'));

    Object.assign(this.answers, await this.prompt([
      {
        type: 'confirm',
        name: 'fonts',
        message: 'Use Fonts task?',
      },
    ]));

    this.log(utils.h2('Scripts'));

    Object.assign(this.answers, {
      babel: undefined,
      xo: undefined,
    }, await this.prompt([
      {
        type: 'confirm',
        name: 'scripts',
        message: 'Use Scripts task?',
      },
      {
        type: 'confirm',
        name: 'babel',
        message: 'Use Babel?',
        when: answers => answers.scripts,
      },
      {
        type: 'confirm',
        name: 'xo',
        message: 'Use XO?',
        when: answers => answers.scripts,
      },
    ]));

    this.log(utils.h2('Views'));

    Object.assign(this.answers, {
      viewsTask: undefined,
      views: undefined,
      port: undefined,
    }, await this.prompt([
      {
        type: 'confirm',
        name: 'viewsTask',
        message: 'Use Views task?',
        when: this.answers.type === 'package',
      },
      {
        type: 'list',
        name: 'views',
        message: 'Language:',
        choices: [
          {
            name: 'Pug',
            value: 'pug',
          },
          {
            name: 'PHP',
            value: 'php',
          },
        ],
        when: answers => this.answers.type !== 'package' || answers.viewsTask,
      },
      {
        type: 'checkbox',
        name: 'viewsSevenOnePattern',
        message: 'Adapted 7-1 Pattern directories:',
        choices: [
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
            name: 'Layout',
            value: 'layout',
            checked: true,
          },
        ],
        when: answers => answers.views === 'pug',
        pageSize: 10,
      },
      {
        type: 'number',
        name: 'port',
        message: 'Port:',
        default: await getPort(),
        validate: answer => Number.isInteger(answer) && answer > 1024 && answer < 65_535 ? true : 'Must be an available port number between 1024 and 65535.',
        filter: answer => Number.isInteger(answer) && answer > 1024 && answer < 65_535 ? answer : '',
        when: answers => answers.views === 'php',
      },
    ]));

    if (this.answers.type === 'website') {
      this.log(utils.h2('Miscellaneous Static Files'));

      Object.assign(this.answers, await this.prompt([
        {
          type: 'confirm',
          name: 'robots',
          message: 'Allow Robots?',
        },
      ]));

      this.log(utils.h2('Deploy'));

      let directory;

      try {
        const url = new URL(this.answers.homepage);

        directory = url.hostname + (url.pathname === '/' ? '' : url.pathname);
      } catch {
        directory = this.answers.package;
      }

      Object.assign(this.answers, await this.prompt([
        {
          name: 'serverHost',
          message: 'Server Host:',
          store: true,
        },
        {
          name: 'serverUser',
          message: 'Server Username:',
          store: true,
        },
        {
          name: 'serverPath',
          message: 'Server Path:',
          default: `/var/www/${directory}`,
        },
      ]));
    }

    if (this.answers.sass) {
      this.answers.styles = true;
    }

    if (this.answers.views) {
      this.answers.viewsTask = true;
    }

    this.log(
      '\n'
      + utils.say(
        chalk.green('All questions asked!') + '\n\n'
        + 'Preparing files now.',
      )
      + '\n',
    );
  }


  configuring() {
    this.composeWith(createRequire(import.meta.url).resolve('generator-license'), {
      name: this.answers.author,
      email: this.answers.email,
      website: this.answers.website,
      year: this.answers.year,
      license: this.answers.license,
    });
  }


  async writing() {
    this.sourceRoot(join(fileURLToPath(new URL('.', import.meta.url)), '../../templates'));

    this.copyTemplate('_editorconfig', '.editorconfig');

    this.renderTemplate('_gitignore', '.gitignore', this.answers);

    this.renderTemplate('_package.json', 'package.json', this.answers);

    await this.addDevDependencies([
      'gulp',
      'gulp-notify',
    ]);

    if (this.answers.styles || this.answers.scripts || this.answers.symbols) {
      await this.addDevDependencies([
        'merge-stream',
        'slash',
      ]);
    }

    if (this.answers.styles) {
      await this.addDevDependencies([
        'postcss',
        'gulp-postcss',
        'autoprefixer',
        'cssnano',
      ]);
    }

    if (this.answers.symbols || this.answers.images || this.answers.scripts || this.answers.views === 'pug') {
      await this.addDevDependencies('gulp-plumber');
    }

    if (this.answers.styles || this.answers.scripts) {
      await this.addDevDependencies('gulp-rename');
    }

    if (this.answers.sass) {
      await this.addDevDependencies([
        'sass',
        'gulp-sass',
      ]);
    }

    if (this.answers.symbols || this.answers.images) {
      await this.addDevDependencies('gulp-imagemin');
    }

    if (this.answers.symbols) {
      await this.addDevDependencies([
        'gulp-svg-sprite',
        '@sindresorhus/slugify',
        'walk-sync',
      ]);
    }

    if (this.answers.overflow) {
      await this.addDevDependencies('gulp-cheerio');
    }

    if (this.answers.scripts) {
      await this.addDevDependencies('gulp-uglify-es');
    }

    if (this.answers.babel) {
      await this.addDevDependencies([
        '@babel/core',
        '@babel/preset-env',
        'gulp-babel',
      ]);
    }

    if (this.answers.views) {
      await this.addDevDependencies('browser-sync');
    }

    if (this.answers.views === 'pug') {
      await this.addDevDependencies('gulp-pug');
    }

    if (this.answers.type === 'website') {
      await this.addDevDependencies([
        'dotenv',
        'gulp-rsync',
      ]);
    }

    if (this.answers.xo) {
      await this.addDevDependencies('xo');
    }

    const devDependencies = this.packageJson.get('devDependencies');
    const orderedDevDependencies = {};

    for (const key of Object.keys(devDependencies).sort()) {
      orderedDevDependencies[key] = `^${devDependencies[key]}`;
    }

    this.packageJson.set('devDependencies', orderedDevDependencies);

    this.renderTemplate('gulpfile.js', 'gulpfile.js', this.answers);

    this.renderTemplate('gulp/(index|config).js', 'gulp', this.answers);

    this.renderTemplate('gulp/tasks/(copy|watch).js', 'gulp/tasks', this.answers);

    if (this.answers.styles || this.answers.symbols || this.answers.scripts) {
      this.renderTemplate('gulp/utils.js', 'gulp/utils.js', this.answers);
    }

    if (this.answers.styles) {
      this.renderTemplate('gulp/tasks/styles.js', 'gulp/tasks/styles.js', this.answers);
    }

    if (this.answers.symbols) {
      this.renderTemplate('gulp/tasks/symbols.js', 'gulp/tasks/symbols.js', this.answers);
    }

    if (this.answers.images) {
      this.renderTemplate('gulp/tasks/images.js', 'gulp/tasks/images.js', this.answers);
    }

    if (this.answers.fonts) {
      this.renderTemplate('gulp/tasks/fonts.js', 'gulp/tasks/fonts.js', this.answers);
    }

    if (this.answers.views) {
      this.renderTemplate('gulp/tasks/(views|browser).js', 'gulp/tasks', this.answers);
    }

    if (this.answers.scripts) {
      this.renderTemplate('gulp/tasks/scripts.js', 'gulp/tasks/scripts.js', this.answers);
    }

    if (this.answers.type === 'website') {
      this.copyTemplate('gulp/tasks/deploy.js', 'gulp/tasks/deploy.js');

      if (this.answers.robots === false) {
        this.copyTemplate('src/robots.txt', 'src/robots.txt');
      }

      if (this.answers.views === 'php') {
        this.copyTemplate('_dockerignore', '.dockerignore');

        this.renderTemplate('_docker-compose.yml', 'docker-compose.yml', this.answers);

        this.renderTemplate('docker/**', 'docker', this.answers);
      }

      this.copyTemplate('_env.template', '.env.template');

      if (this.answers.serverHost && this.answers.serverUser && this.answers.serverPath) {
        this.renderTemplate('_env', '.env', this.answers);
      }
    }

    this.copyTemplate('src/_placeholder', 'src/_placeholder');

    if (this.answers.sass) {
      this.renderTemplate('src/styles/sass/main.sass', 'src/styles/main.sass', this.answers);

      if (this.answers.sevenOnePattern) {
        if (this.answers.sevenOnePattern.some(directory => directory.startsWith('abstracts'))) {
          this.renderTemplate('src/styles/sass/abstracts/_index.sass', 'src/styles/abstracts/_index.sass', this.answers);
        }

        if (this.answers.sevenOnePattern.includes('abstracts/settings')) {
          this.copyTemplate('src/styles/sass/abstracts/settings/_tokens.scss', 'src/styles/abstracts/settings/_tokens.scss');

          if (this.answers.sevenOnePattern.includes('base')) {
            this.copyTemplate('src/styles/sass/abstracts/settings/base/**', 'src/styles/abstracts/settings/base');
          }

          if (this.answers.sevenOnePattern.includes('components')) {
            this.copyTemplate('src/styles/sass/abstracts/settings/components/**', 'src/styles/abstracts/settings/components');
          }

          if (this.answers.sevenOnePattern.includes('layout')) {
            this.copyTemplate('src/styles/sass/abstracts/settings/layout/**', 'src/styles/abstracts/settings/layout');
          }

          if (this.answers.sevenOnePattern.includes('pages')) {
            this.copyTemplate('src/styles/sass/abstracts/settings/pages/**', 'src/styles/abstracts/settings/pages');
          }

          if (this.answers.sevenOnePattern.includes('themes')) {
            this.copyTemplate('src/styles/sass/abstracts/settings/themes/**', 'src/styles/abstracts/settings/themes');
          }
        }

        if (this.answers.sevenOnePattern.includes('abstracts/functions')) {
          this.copyTemplate('src/styles/sass/abstracts/functions/**', 'src/styles/abstracts/functions');
        }

        if (this.answers.sevenOnePattern.includes('abstracts/mixins')) {
          this.copyTemplate('src/styles/sass/abstracts/mixins/**', 'src/styles/abstracts/mixins');
        }

        if (this.answers.sevenOnePattern.includes('base')) {
          this.renderTemplate('src/styles/sass/base/**/_!(svg|font-face).sass', 'src/styles/base', this.answers);

          if (this.answers.symbols) {
            this.renderTemplate('src/styles/sass/base/_svg.sass', 'src/styles/base/_svg.sass', this.answers);
          }

          if (this.answers.fonts) {
            this.copyTemplate('src/styles/sass/base/_font-face.sass', 'src/styles/base/_font-face.sass');
          }
        }

        if (this.answers.sevenOnePattern.includes('components')) {
          this.copyTemplate('src/styles/sass/components/**', 'src/styles/components');
        }

        if (this.answers.sevenOnePattern.includes('layout')) {
          this.copyTemplate('src/styles/sass/layout/**', 'src/styles/layout');
        }

        if (this.answers.sevenOnePattern.includes('pages')) {
          this.copyTemplate('src/styles/sass/pages/**', 'src/styles/pages');
        }

        if (this.answers.sevenOnePattern.includes('themes')) {
          this.copyTemplate('src/styles/sass/themes/**', 'src/styles/themes');
        }

        if (this.answers.sevenOnePattern.includes('vendors')) {
          this.copyTemplate('src/styles/sass/vendors/**', 'src/styles/vendors');
        }
      }
    } else if (this.answers.styles) {
      this.copyTemplate('src/styles/css/main.css', 'src/styles/main.css');
    }

    if (this.answers.symbols) {
      this.renderTemplate('src/symbols/**', 'src/symbols', this.answers);
    }

    if (this.answers.images) {
      this.renderTemplate('src/images/**', 'src/images', this.answers);
    }

    if (this.answers.fonts) {
      this.renderTemplate('src/fonts/**', 'src/fonts', this.answers);
    }

    if (this.answers.scripts) {
      this.copyTemplate('src/scripts/**', 'src/scripts');
    }

    if (this.answers.views) {
      this.renderTemplate(`src/views/${this.answers.views}/index.pug`, 'src/views/index.pug', this.answers);
    }

    if (this.answers.viewsSevenOnePattern) {
      if (this.answers.viewsSevenOnePattern.some(directory => directory.startsWith('abstracts'))) {
        this.renderTemplate('src/views/pug/_abstracts/index.pug', 'src/views/_abstracts/index.pug', this.answers);
      }

      if (this.answers.viewsSevenOnePattern.includes('abstracts/settings')) {
        this.copyTemplate('src/views/pug/_abstracts/settings/**', 'src/views/_abstracts/settings');
      }

      if (this.answers.viewsSevenOnePattern.includes('abstracts/functions')) {
        this.copyTemplate('src/views/pug/_abstracts/functions/**', 'src/views/_abstracts/functions');
      }

      if (this.answers.viewsSevenOnePattern.includes('abstracts/mixins')) {
        this.copyTemplate('src/views/pug/_abstracts/mixins/**', 'src/views/_abstracts/mixins');
      }

      if (this.answers.viewsSevenOnePattern.includes('layout')) {
        this.renderTemplate('src/views/pug/_layout/**', 'src/views/_layout', this.answers);
      }
    }
  }


  end() {
    // Remove Yeoman Storage file. Not needed for the project.
    rmSync(this.destinationPath('.yo-rc.json'));

    // Remove placeholder files used to create directories.
    rmSync(this.destinationPath('src/**/_placeholder'));

    // Create a Git repository.
    this.spawnCommandSync('git', ['init', '--quiet']);

    this.log(utils.say(
      chalk.green('Configuration is ready!') + '\n\n'
      + 'You can start by committing these newly added files.\n\n'
      + chalk.yellow(' Good work! '), // FIXME: Spacings is for a workaround of an issue on chalk not coloring X letters when `\n` is present X+1 times before them.
    ));
  }
}
