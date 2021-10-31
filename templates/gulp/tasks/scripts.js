import gulp from 'gulp';
import plumber from 'gulp-plumber';
<% if (babel) { -%>
import babel from 'gulp-babel';
<% } -%>
import notify, {onError} from 'gulp-notify';
import uglifyEs from 'gulp-uglify-es';

import config from '../config.js';



const {src, dest} = gulp;
const {default: uglify} = uglifyEs;



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
      message: '<%%= error.message %>',
    }))
    <%_ } -%>
    .pipe(dest(config.build.scripts))
    .pipe(notify({
      message: 'JavaScript generated!',
      onLast: true,
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
      message: '<%%= error.message %>',
    }))
    .pipe(dest(config.dist.scripts))
    .pipe(notify({
      message: 'JavaScript uglified!',
      onLast: true,
    }));
