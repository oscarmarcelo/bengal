import gulp from 'gulp';
<% if (stylesLanguage === 'sass') { -%>
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
<% } -%>
import notify<% if (stylesLanguage === 'sass') { %>, {onError}<% } %> from 'gulp-notify';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
<% if (stylesLanguage === 'sass') { -%>
import rename from 'gulp-rename';
<% } -%>
<% if (views) { -%>
import {reload} from 'browser-sync';
<% } -%>
import cssnano from 'cssnano';

import config from '../config.js';
<% if (stylesLanguage === 'sass') { -%>
import {dirToFile} from '../utils.js';
<% } -%>



const {src, dest} = gulp;
<% if (stylesLanguage === 'sass') { -%>
const sass = gulpSass(dartSass);
<% } -%>



/*
 * =============================================================================
 <%_ if (stylesLanguage === 'sass') { -%>
 * Compile Sass files.
 <%_ } -%>
 * Autoprefix.
 * Inject files into browser.
 * Notify end of task.
 * =============================================================================
 */

const build = () =>
  src(config.src.styles)
    <%_ if (stylesLanguage === 'sass') { -%>
    .pipe(sass())
    .on('error', onError({
      title: 'Error in styles',
      message: '<%%= error.message %>',
    }))
    <%_ } -%>
    .pipe(postcss([
      autoprefixer(),
    ]))
    <%_ if (stylesLanguage === 'sass') { -%>
    .pipe(rename(dirToFile))
    <%_ } -%>
    .pipe(dest(config.build.styles))
    <%_ if (views) { -%>
    .pipe(reload({
      stream: true,
    }))
    <%_ } -%>
    .pipe(notify({
      message: 'Styles generated!',
      onLast: true,
    }));



/*
 * =============================================================================
 * Minify styles.
 * Notify end of task.
 * =============================================================================
 */

const dist = () =>
  src(config.build.globs.styles)
    .pipe(postcss([
      cssnano(),
    ]))
    .pipe(dest(config.dist.styles))
    .pipe(notify({
      message: 'Styles minified!',
      onLast: true,
    }));



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

build.displayName = 'styles:build';
dist.displayName = 'styles:dist';

export {
  build,
  dist,
};
