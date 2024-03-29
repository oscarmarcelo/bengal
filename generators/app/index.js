import {createRequire} from 'node:module';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

import updateNotifier from 'update-notifier';
import Generator from 'yeoman-generator';
import ConfigStore from 'configstore';
import chalk from 'chalk';
import semver from 'semver';
import {deleteSync} from 'del';

import * as utilities from './utilities.js';
import * as common from './modules/common.js';
import * as project from './modules/project.js';
import * as author from './modules/author.js';
import * as license from './modules/license.js';
import * as styles from './modules/styles.js';
import * as symbols from './modules/symbols.js';
import * as images from './modules/images.js';
import * as fonts from './modules/fonts.js';
import * as scripts from './modules/scripts.js';
import * as views from './modules/views.js';
import * as misc from './modules/misc.js';
import * as deploy from './modules/deploy.js';



const pkg = createRequire(import.meta.url)('../../package.json');
const notifier = updateNotifier({pkg});
const store = new ConfigStore(pkg.name);



notifier.notify({
  message: `Update available for ${chalk.yellow.bold('Bengal')}`
    + ' \n\n'
    + `${chalk.dim('{currentVersion}')} ${chalk.reset('→')} ${chalk.green('{latestVersion}')}`
    + ' \n\n'
    + `Run ${chalk.cyan('{updateCommand}')} to update`,
});



export default class Bengal extends Generator {
  async initializing() {
    const lastUpdateCheck = store.get('lastUpdateCheck');

    if (typeof lastUpdateCheck !== 'number' || Date.now() - lastUpdateCheck >= 1000 * 60 * 60 * 24) {
      this.user.github.username()
        .then(username => {
          store.set('username', username);
        });

      await notifier.fetchInfo()
        .then(data => {
          store.set('update', data);
        });

      store.set('lastUpdateCheck', Date.now());
    }

    const update = store.get('update');

    const updateMessage = semver.lt(pkg.version, update.latest) && ['build', 'latest'].includes(update.type) === false
      ? `${chalk.green('There is an update you might want to check before continuing.')}\n\n`
      : '';

    this.log(utilities.say(
      chalk.red(`Welcome to ${chalk.yellow.bold('Bengal')}!`) + '\n\n'
      + updateMessage
      + 'Let me start by asking a few questions about your project.',
    ));
  }


  async prompting() {
    this.answers = {};

    const sections = [
      {
        heading: 'Project',
        module: project,
      },
      {
        heading: 'Author',
        module: author,
        defaults: {
          author: this.user.git.name(),
          username: store.get('username'),
          email: this.user.git.email(),
        },
      },
      {
        heading: 'License',
        module: license,
      },
      {
        heading: 'Tasks',
        sections: [
          {
            heading: 'Styles',
            module: styles,
          },
          {
            heading: 'SVG Symbols',
            module: symbols,
          },
          {
            heading: 'Images',
            module: images,
          },
          {
            heading: 'Fonts',
            module: fonts,
          },
          {
            heading: 'Scripts',
            module: scripts,
          },
          {
            heading: 'Views',
            module: views,
          },
          {
            heading: 'Miscellaneous Static Files',
            module: misc,
            when: () => this.answers.type === 'website',
          },
          {
            heading: 'Deploy',
            module: deploy,
            when: () => this.answers.type === 'website',
          },
        ],
      },
    ];

    const runSections = async (list, level = 1) => {
      for (const [index, {heading, sections, module, defaults, when}] of list.entries()) {
        if (when === undefined || (when && when())) {
          this.log(utilities[`h${level}`](heading, index === 0));

          if (sections) {
            await runSections(sections, level + 1); // eslint-disable-line no-await-in-loop
          } else {
            Object.assign(this.answers, await module.prompts(this, defaults)); // eslint-disable-line no-await-in-loop
          }
        }
      }
    };

    await runSections(sections);

    this.log(
      '\n'
      + utilities.say(
        chalk.green('All questions asked!') + '\n\n'
        + 'Preparing files now.',
      )
      + '\n',
    );
  }


  configuring() {
    this.answers.bengalVersion = this.rootGeneratorVersion();

    project.configuration(this);
    license.configuration(this);
  }


  async writing() {
    this.sourceRoot(join(fileURLToPath(new URL('.', import.meta.url)), '../../templates'));

    const modules = [
      {
        module: common,
      },
      {
        module: styles,
        when: this.answers.styles,
      },
      {
        module: symbols,
        when: this.answers.symbols,
      },
      {
        module: images,
        when: this.answers.images,
      },
      {
        module: fonts,
        when: this.answers.fonts,
      },
      {
        module: scripts,
        when: this.answers.scripts,
      },
      {
        module: views,
        when: this.answers.views,
      },
      {
        module: misc,
        when: this.answers.type === 'website',
      },
      {
        module: deploy,
        when: this.answers.type === 'website',
      },
    ];

    let devDependencies = [];

    for (const {module, when} of modules) {
      if (when === undefined || when) {
        if (module.files) {
          module.files(this);
        }

        if (module.dependencies) {
          devDependencies.push(...module.dependencies(this));
        }
      }
    }

    devDependencies = [...new Set(devDependencies)].sort();
    devDependencies = await this.addDevDependencies(devDependencies);

    for (const [name, version] of Object.entries(devDependencies)) {
      devDependencies[name] = `^${version}`;
    }

    this.packageJson.set('devDependencies', devDependencies);
  }


  end() {
    // Remove Yeoman Storage file. Not needed for the project.
    deleteSync(this.destinationPath('.yo-rc.json'));

    // Remove placeholder files used to create directories.
    deleteSync(this.destinationPath('src/**/_placeholder'));

    // Create a Git repository.
    this.spawnCommandSync('git', ['init', '--quiet']);

    this.log(utilities.say(
      chalk.green('Configuration is ready!') + '\n\n'
      + 'You can start by committing these newly added files.\n\n'
      + chalk.yellow(' Good work! '), // FIXME: Spacings are a workaround for an issue in yosay causing chalk to not color X letters when `\n` is present X+1 times before them.
    ));
  }
}
