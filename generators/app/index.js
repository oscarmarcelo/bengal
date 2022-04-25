import {createRequire} from 'node:module';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

import updateNotifier from 'update-notifier';
import Generator from 'yeoman-generator';
import chalk from 'chalk';
import rimraf from 'rimraf';

import * as utils from './utils.js';
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



const {sync: rmSync} = rimraf;
const pkg = createRequire(import.meta.url)('../../package.json');
const notifier = updateNotifier({pkg});



notifier.notify({
  message: `Update available for ${chalk.yellow.bold('Bengal')}`
    + ' \n\n'
    + `${chalk.dim('{currentVersion}')} ${chalk.reset('→')} ${chalk.green('{latestVersion}')}`
    + ' \n\n'
    + `Run ${chalk.cyan('{updateCommand}')} to update`,
});



export default class Bengal extends Generator {
  async initializing() {
    const updateInfo = await notifier.fetchInfo();

    const updateMessage = ['build', 'latest'].includes(updateInfo.type)
      ? ''
      : `${chalk.green('There is an update you might want to check before continuing.')}\n\n`;

    this.log(utils.say(
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
      for (const [index, {heading, sections, module, when}] of list.entries()) {
        if (typeof when === 'undefined' || (when && when())) {
          this.log(utils[`h${level}`](heading, index === 0));

          if (sections) {
            await runSections(sections, level + 1); // eslint-disable-line no-await-in-loop
          } else {
            Object.assign(this.answers, await module.prompts(this)); // eslint-disable-line no-await-in-loop
          }
        }
      }
    };

    await runSections(sections);

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
        when: this.answers.viewsTask,
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
      if (typeof when === 'undefined' || when) {
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
    rmSync(this.destinationPath('.yo-rc.json'));

    // Remove placeholder files used to create directories.
    rmSync(this.destinationPath('src/**/_placeholder'));

    // Create a Git repository.
    this.spawnCommandSync('git', ['init', '--quiet']);

    this.log(utils.say(
      chalk.green('Configuration is ready!') + '\n\n'
      + 'You can start by committing these newly added files.\n\n'
      + chalk.yellow(' Good work! '), // FIXME: Spacings are a workaround for an issue in yosay causing chalk to not color X letters when `\n` is present X+1 times before them.
    ));
  }
}
