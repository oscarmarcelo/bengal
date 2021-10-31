import gulp from 'gulp';
import plumber from 'gulp-plumber';
<% if (overflow) { -%>
import cheerio from 'gulp-cheerio';
<% } -%>
import imagemin from 'gulp-imagemin';
import svgSprite from 'gulp-svg-sprite';
import notify, {onError} from 'gulp-notify';
import merge from 'merge-stream';

import config from '../config.js';
import {getDirs, path} from '../utils.js';



const {src, dest} = gulp;



/**
 * ================================
 <%_ if (overflow) { -%>
 * Add visible overflow to all SVG files.
 <%_ } -%>
 * Optimize SVG files.
 * Concatenate SVG files into symbols files.
 * Notify end of task.
 * ================================
 */

export default done => {
  const dirs = getDirs(config.src.symbols);

  if (dirs.length === 0) {
    return done();
  }

  const subtasks = dirs.map(dir =>
    src(path(config.src.symbols, dir, '/*.svg'))
      .pipe(plumber())
      <%_ if (overflow) { -%>
      .pipe(cheerio(($, file) => { // eslint-disable-line no-unused-vars
        $('svg').attr('overflow', 'visible');
      }))
      <%_ } -%>
      .pipe(imagemin({
        svgoPlugins: [{
          removeViewBox: false
        }]
      }))
      .pipe(svgSprite({
        mode: {
          symbol: {
            dest: '.',
            sprite: `${dir === '.' ? '<%= defaultSymbol %>' : dir}.svg`
          }
        },
        svg: {
          xmlDeclaration: false,
          doctypeDeclaration: false
        }
      }))
      .on('error', onError({
        title: 'Error in symbols',
        message: '<%%= error.message %>'
      }))
      .pipe(dest(config.build.images))
  );

  return merge(subtasks)
    .pipe(notify({
      message: 'Symbols generated!',
      onLast: true
    }));
};
