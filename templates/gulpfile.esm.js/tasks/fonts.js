import {src, dest} from 'gulp';
import {reload} from 'browser-sync';
import notify from 'gulp-notify';

import config from '../config';



/**
 * ================================
 * Copy fonts.
 * Notify end of task.
 * ================================
 */

export default () =>
  src(config.src.fonts)
    .pipe(dest(config.build.fonts))
    .pipe(reload({
      stream: true
    }))
    .pipe(notify({
      message: 'Fonts copied!',
      onLast: true
    }));
