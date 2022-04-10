import gulp from 'gulp';
<% if (typeof sass !== 'undefined' && sass) { -%>
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
<% } -%>
import notify<% if (typeof sass !== 'undefined' && sass) { %>, {onError}<% } %> from 'gulp-notify';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
<% if (typeof sass !== 'undefined' && sass) { -%>
import rename from 'gulp-rename';
<% } -%>
<% if (typeof views !== 'undefined' && views) { -%>
import {reload} from 'browser-sync';
<% } -%>
import cssnano from 'cssnano';

import config from '../config.js';
<% if (typeof sass !== 'undefined' && sass) { -%>
import {dirToFile} from '../utils.js';
<% } -%>



const {src, dest} = gulp;
<% if (typeof sass !== 'undefined' && sass) { -%>
const sass = gulpSass(dartSass);
<% } -%>



/**
 * ================================
 <%_ if (typeof sass !== 'undefined' && sass) { -%>
 * Compile Sass files.
 <%_ } -%>
 * Autoprefix.
 * Inject files into browser.
 * Notify end of task.
 * ================================
 */

export const build = () =>
  src(config.src.styles)
    <%_ if (typeof sass !== 'undefined' && sass) { -%>
    .pipe(sass())
    .on('error', onError({
      title: 'Error in styles',
      message: '<%%= error.message %>',
    }))
    <%_ } -%>
    .pipe(postcss([
      autoprefixer(),
    ]))
    <%_ if (typeof sass !== 'undefined' && sass) { -%>
    .pipe(rename(dirToFile))
    <%_ } -%>
    .pipe(dest(config.build.styles))
    <%_ if (typeof views !== 'undefined' && views) { -%>
    .pipe(reload({
      stream: true,
    }))
    <%_ } -%>
    .pipe(notify({
      message: 'CSS generated!',
      onLast: true,
    }));



/**
 * ================================
 * Compress styles.
 * Notify end of task.
 * ================================
 */

export const dist = () =>
  src(config.build.globs.styles)
    .pipe(postcss([
      cssnano(),
    ]))
    .pipe(dest(config.dist.styles))
    .pipe(notify({
      message: 'CSS minified!',
      onLast: true,
    }));
