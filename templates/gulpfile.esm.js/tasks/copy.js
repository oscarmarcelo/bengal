import {src, dest} from 'gulp';
import notify from 'gulp-notify';

import config from '../config';



/*
 * ========================================================
 * Copy all built files to `dist` folder, except styles and scripts.
 * Notify end of task.
 * ========================================================
 */

export default () => {
  const excludedGlobs = Object.assign({}, config.build.globs);

  delete excludedGlobs.all;

  return src(config.build.globs.all, {
    ignore: Object.values(excludedGlobs)
  })
    .pipe(dest(config.dist.base))
    .pipe(notify({
      message: 'Build files copied!',
      onLast: true
    }));
}
