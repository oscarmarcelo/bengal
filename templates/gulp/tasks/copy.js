import gulp from 'gulp';
<% if (styles || scripts) { -%>
import merge from 'merge-stream';
import rename from 'gulp-rename';
<% } -%>
import notify from 'gulp-notify';

import config from '../config.js';
<% if (styles || scripts) { -%>
import {path} from '../utilities.js';
<% } -%>



const {src, dest} = gulp;



/*
 * =============================================================================
 * Copy all files in the root of `src` to `build` folder.
 * Notify end of task.
 * =============================================================================
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
<% if (styles || scripts) { -%>



/*
 * =============================================================================
 * Copy vendor files to `build` folder.
 * Notify end of task.
 * =============================================================================
 */

const vendor = done => {
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

  if (vendors.isEmpty()) {
    done();
  }

  return merge(vendors)
    .pipe(notify({
      message: 'Vendor files copied!',
      onLast: true,
    }));
};
<% } -%>



/*
 * =============================================================================
 * Copy all built files to `dist` folder, except the ones to be optimized for distribution.
 * Notify end of task.
 * =============================================================================
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



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

build.displayName = 'copy:build';
<% if (styles || scripts) { -%>
vendor.displayName = 'copy:vendor';
<% } -%>
dist.displayName = 'copy:dist';

export {
  build,
  <%_ if (styles || scripts) { -%>
  vendor,
  <%_ } -%>
  dist,
};
