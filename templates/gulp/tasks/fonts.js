import gulp from 'gulp';
import notify from 'gulp-notify';

import config from '../config.js';
<% if (views) { -%>
import {getBrowserSync} from '../utilities.js';
<% } -%>



const {src, dest} = gulp;
<% if (views) { -%>
const {reload} = getBrowserSync();
<% } -%>


/*
 * =============================================================================
 * Copy fonts.
 * Notify end of task.
 * =============================================================================
 */

const build = () =>
  src(config.src.fonts)
    .pipe(dest(config.build.fonts))
    <%_ if (views) { -%>
    .pipe(reload({
      stream: true,
    }))
    <%_ } -%>
    .pipe(notify({
      message: 'Fonts copied!',
      onLast: true,
    }));



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

build.displayName = 'fonts:build';

export default build;
