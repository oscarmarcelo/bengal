import gulp from 'gulp';
<%_ if ((typeof styles !== 'undefined' && styles) || (typeof sass !== 'undefined' && sass) || scripts) { -%>
import merge from 'merge-stream';
import rename from 'gulp-rename';
<%_ } -%>
import notify from 'gulp-notify';

import config from '../config.js';
<%_ if ((typeof styles !== 'undefined' && styles) || (typeof sass !== 'undefined' && sass) || scripts) { -%>
import {path} from '../utils.js';
<%_ } -%>



const {src, dest} = gulp;



/*
 * ========================================================
 * Copy all files in the root of `src` to `build` folder.
 * Notify end of task.
 * ========================================================
 */

const build = () =>
  src(config.src.base, {
    nodir: true,
  })
    .pipe(dest(config.build.base))
    .pipe(notify({
      message: 'Static files copied!',
      onLast: true,
    }));
<%_ if ((typeof styles !== 'undefined' && styles) || (typeof sass !== 'undefined' && sass) || scripts) { -%>



/*
 * ========================================================
 * Copy vendor files to `build` folder.
 * Notify end of task.
 * ========================================================
 */

const vendor = () => {
  const vendors = merge();

  for (const [type, typeFiles] of Object.entries(config.src.vendors)) {
    for (const [distFile, srcFile] of Object.entries(typeFiles)) {
      vendors.add(
        src(path('node_modules', srcFile))
          .pipe(rename(distFile))
          .pipe(dest(path(config.build[type], 'vendors'))),
      );
    }
  }

  return merge(vendors)
    .pipe(notify({
      message: 'Vendor files copied!',
      onLast: true,
    }));
};
<%_ } -%>



/*
 * ========================================================
 * Copy all built files to `dist` folder, except the ones to be optimized for distribution.
 * Notify end of task.
 * ========================================================
 */

const dist = () => {
  const excludedGlobs = {...config.build.globs};

  delete excludedGlobs.all;

  return src(config.build.globs.all, {
    ignore: Object.values(excludedGlobs),
  })
    .pipe(dest(config.dist.base))
    .pipe(notify({
      message: 'Build files copied!',
      onLast: true,
    }));
};



export {
  build,
  <%_ if ((typeof styles !== 'undefined' && styles) || (typeof sass !== 'undefined' && sass) || scripts) { -%>
  vendor,
  <%_ } -%>
  dist,
};
