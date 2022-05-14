import gulp from 'gulp';
<% if (viewsLanguage === 'pug') { -%>
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
<% } -%>
import notify from 'gulp-notify';

import config from '../config.js';



const {src, dest} = gulp;



/*
 * =============================================================================
 <%_ if (viewsLanguage === 'pug') { -%>
 * Compile Pug files.
 <%_ } -%>
 <%_ if (viewsLanguage === 'php') { -%>
 * Copy PHP files.
 <%_ } -%>
 <%_ if (viewsLanguage === 'html') { -%>
 * Copy HTML files.
 <%_ } -%>
 * Notify end of task.
 * =============================================================================
 */

const build = () =>
  <%_ if (viewsLanguage === 'pug') { -%>
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
  <%_ if (['php', 'html'].includes(viewsLanguage)) { -%>
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
