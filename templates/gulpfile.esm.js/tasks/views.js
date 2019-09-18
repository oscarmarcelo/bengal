import {src, dest} from 'gulp';
<% if (views === 'pug') { -%>
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
<% } -%>
import notify from 'gulp-notify';

import config from '../config';



/**
 * ================================
 <%_ if (views === 'pug') { -%>
 * Compile Pug files.
 <%_ } -%>
 <%_ if (views === 'php') { -%>
 * Copy PHP files.
 <%_ } -%>
 * Notify end of task.
 * ================================
 */

export default () =>
  <%_ if (views === 'php') { -%>
  src(config.src.views)
  <%_ } -%>
  <%_ if (views === 'pug') { -%>
  src([
    config.src.views,
    '!**/_*'
  ])
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    <%_ } -%>
    .pipe(dest(config.build.views))
    .pipe(notify({
      message: 'HTML generated!',
      onLast: true
    }));
