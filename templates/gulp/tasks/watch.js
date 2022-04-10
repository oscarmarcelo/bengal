import gulp from 'gulp';

import config from '../config.js';

<% if ((typeof styles !== 'undefined' && styles) || type !== 'package') { -%>
import {build as styles} from './styles.js';
<% } -%>
<% if (symbols) { -%>
import symbols from './symbols.js';
<% } -%>
<% if (images) { -%>
import images from './images.js';
<% } -%>
<% if (fonts) { -%>
import fonts from './fonts.js';
<% } -%>
<% if (scripts) { -%>
import {build as scripts} from './scripts.js';
<% } -%>
import views from './views.js';
import {build as copy} from './copy.js';
import {reload} from './browser.js';



const {watch, series} = gulp;



/**
 * ================================
 * Watch files.
 * ================================
 */

const build = done => {
  <%_ if ((typeof styles !== 'undefined' && styles) || type !== 'package') { -%>
  // When styles update, <% if (typeof sass !== 'undefined' && sass) { %>compile Sass<% } else { %>copy CSS<% } %> files.
  watch(config.src.styles, styles);

  <%_ } -%>
  <%_ if (symbols) { -%>
  // When symbols update, compile symbols and reload browser.
  watch(config.src.symbols, series(symbols, reload));

  <%_ } -%>
  <%_ if (images) { -%>
  // When images update, optimize images and reload browser.
  watch(config.src.images, series(images, reload));

  <%_ } -%>
  <%_ if (fonts) { -%>
  // When fonts update, copy fonts.
  watch(config.src.fonts, fonts);

  <%_ } -%>
  <%_ if (scripts) { -%>
  // When scripts update, compile scripts and reload browser.
  watch(config.src.scripts, series(scripts, reload));

  <%_ } -%>
  // When views update, <% if (views === 'pug') { %>compile<% } else { %>copy<% } %> views and reload browser.
  watch(config.src.views, series(views, reload));

  // When static files in the root update, copy them.
  watch(config.src.base, series(copy, reload));

  done();
};



export default build;
