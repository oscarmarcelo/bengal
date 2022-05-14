import gulp from 'gulp';
<% if (views === 'pug') { -%>
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
<% } -%>
import notify from 'gulp-notify';

import config from '../config.js';



const {src, dest} = gulp;



/*
 * =============================================================================
 <%_ if (views === 'pug') { -%>
 * Compile Pug files.
 <%_ } -%>
 <%_ if (views === 'php') { -%>
 * Copy PHP files.
 <%_ } -%>
 <%_ if (views === 'html') { -%>
 * Copy HTML files.
 <%_ } -%>
 * Notify end of task.
 * =============================================================================
 */

const build = () =>
  <%_ if (views === 'pug') { -%>
  src([
    config.src.views,
    '!**/_*/**',
    '!**/_*',
  ])
    .pipe(plumber())
    .pipe(pug({
      pretty: true,
    }))
  <%_ } -%>
  <%_ if (['php', 'html'].includes(views)) { -%>
  src(config.src.views)
  <%_ } -%>
    .pipe(dest(config.build.views))
    .pipe(notify({
      message: 'Views generated!',
      onLast: true,
    }));



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

build.displayName = 'views:build';

export default build;
