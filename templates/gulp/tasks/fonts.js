import gulp from 'gulp';
<% if (views) { -%>
import {reload} from 'browser-sync';
<% } -%>
import notify from 'gulp-notify';

import config from '../config.js';



const {src, dest} = gulp;



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
