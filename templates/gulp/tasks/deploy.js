import {env} from 'node:process';

import {config as dotenv} from 'dotenv';
import gulp from 'gulp';
import rsync from 'gulp-rsync';
import notify from 'gulp-notify';

import config from '../config.js';



const {src} = gulp;



/*
 * =============================================================================
 * Retrieve environment variables.
 * Synchronize all distibution files with the server.
 * Notify end of task.
 * =============================================================================
 */

const deploy = () => {
  dotenv();

  return src(config.dist.globs.all)
    .pipe(rsync({
      root: config.dist.base,
      destination: env.SERVER_PATH,
      hostname: env.SERVER_HOST,
      username: env.SERVER_USER,
      archive: true,
      incremental: true,
      clean: true,
    }))
    .pipe(notify({
      message: 'Website deployed!',
      onLast: true,
    }));
};



export default deploy;
