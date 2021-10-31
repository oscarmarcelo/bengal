import {config as dotenv} from 'dotenv';
import gulp from 'gulp';
import rsync from 'gulp-rsync';
import notify from 'gulp-notify';

import config from '../config.js';



const {src} = gulp;



/*
 * ========================================================
 * Retrieve environment variables.
 * Synchronize all distibution files with the server.
 * Notify end of task.
 * ========================================================
 */

export default () => {
  dotenv();

  return src(config.dist.globs.all)
    .pipe(rsync({
      root: config.dist.base,
      destination: process.env.SERVER_PATH,
      hostname: process.env.SERVER_HOST,
      username: process.env.SERVER_USER,
      archive: true,
      incremental: true,
      clean: true
    }))
    .pipe(notify({
      message: 'Website deployed!',
      onLast: true
    }));
};
