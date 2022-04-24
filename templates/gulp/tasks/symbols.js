import {parse as parsePath} from 'node:path';

import gulp from 'gulp';
import plumber from 'gulp-plumber';
<% if (overflow) { -%>
import cheerio from 'gulp-cheerio';
<% } -%>
import imagemin from 'gulp-imagemin';
import svgSprite from 'gulp-svg-sprite';
import slugify from '@sindresorhus/slugify';
import notify, {onError} from 'gulp-notify';
import merge from 'merge-stream';

import config from '../config.js';
import {getDirs, path} from '../utils.js';



const {src, dest} = gulp;



/*
 * =============================================================================
 <%_ if (overflow) { -%>
 * Add visible overflow to all SVG files.
 <%_ } -%>
 * Optimize SVG files.
 * Concatenate SVG files into symbols files.
 * Notify end of task.
 * =============================================================================
 */

const build = () => {
  const dirs = getDirs(config.src.symbols);

  const subtasks = dirs.map(dir =>
    src(path(config.src.symbols, dir, '*.svg'))
      .pipe(plumber())
      <%_ if (overflow) { -%>
      .pipe(cheerio(($, _) => {
        $('svg').attr('overflow', 'visible');
      }))
      <%_ } -%>
      .pipe(imagemin({
        svgoPlugins: [{
          removeViewBox: false,
        }],
      }))
      .pipe(svgSprite({
        mode: {
          symbol: {
            dest: '.',
            sprite: `${dir === '.' ? '<%= defaultSymbol %>' : dir}.svg`,
          },
        },
        shape: {
          id: {
            generator: (name, _) => slugify(parsePath(name).name),
          },
        },
        svg: {
          xmlDeclaration: false,
          doctypeDeclaration: false,
        },
      }))
      .on('error', onError({
        title: 'Error in symbols',
        message: '<%%= error.message %>',
      }))
      .pipe(dest(config.build.images)),
  );

  return merge(subtasks)
    .pipe(notify({
      message: 'Symbols generated!',
      onLast: true,
    }));
};



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

build.displayName = 'symbols:build';

export default build;
