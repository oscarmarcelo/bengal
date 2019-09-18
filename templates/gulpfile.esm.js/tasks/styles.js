import {src, dest} from 'gulp';
<% if (sass) { -%>
import sass from 'gulp-sass';
<% } -%>
import {default as notify<% if (sass) { %>, onError<% } %>} from 'gulp-notify';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
<% if (sass) { -%>
import rename from 'gulp-rename';
<% } -%>
import {reload} from 'browser-sync';
import cssnano from 'cssnano';

import config from '../config';
<% if (sass) { -%>
import {dirToFile} from '../utils';
<% } -%>



/**
 * ================================
 <%_ if (sass) { -%>
 * Compile Sass files.
 <%_ } -%>
 * Autoprefix.
 * Inject files into browser.
 * Notify end of task.
 * ================================
 */

export const build = () =>
  src(config.src.styles)
    <%_ if (sass) { -%>
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 10
    }))
    .on('error', onError({
      title: 'Error in styles',
      message: '<%%= error.message %>'
    }))
    <%_ } -%>
    .pipe(postcss([
      autoprefixer()
    ]))
    <%_ if (sass) { -%>
    .pipe(rename(dirToFile))
    <%_ } -%>
    .pipe(dest(config.build.styles))
    .pipe(reload({
      stream: true
    }))
    .pipe(notify({
      message: 'CSS generated!',
      onLast: true
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
      cssnano()
    ]))
    .pipe(dest(config.dist.base))
    .pipe(notify({
      message: 'CSS minified!',
      onLast: true
    }));
