import {src, dest} from 'gulp';
import plumber from 'gulp-plumber';
<% if (babel) { -%>
import babel from 'gulp-babel';
<% } -%>
import notify, {onError} from 'gulp-notify';
import uglify from 'gulp-uglify-es';

import config from '../config';



/**
 * ================================
 <%_ if (babel) { -%>
 * Compile JavaScript.
 <%_ } else { -%>
 * Copy Scripts.
 <%_ } -%>
 * Notify end of task.
 * ================================
 */

export const build = () =>
  src(config.src.scripts)
    <%_ if (babel) { -%>
    .pipe(plumber())
    .pipe(babel())
    .on('error', onError({
      title: 'Error in scripts',
      message: '<%%= error.message %>'
    }))
    <%_ } -%>
    .pipe(dest(config.build.scripts))
    .pipe(notify({
      message: 'JavaScript generated!',
      onLast: true
    }));



/*
 * ========================================================
 * Uglify JavaScript.
 * Notify end of task.
 * ========================================================
 */

export const dist = () =>
  src(config.build.globs.scripts)
    .pipe(plumber())
    .pipe(uglify())
    .on('error', onError({
      title: 'Error in scripts for distribution',
      message: '<%%= error.message %>'
    }))
    .pipe(dest(config.dist.base))
    .pipe(notify({
      message: 'JavaScript uglified!',
      onLast: true
    }));
