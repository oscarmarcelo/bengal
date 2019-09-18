import {watch, series} from 'gulp';

import config from '../config';

import {build as styles} from './styles';
<% if (symbols) { -%>
import symbols from './symbols';
<% } -%>
<% if (images) { -%>
import images from './images';
<% } -%>
<% if (fonts) { -%>
import fonts from './fonts';
<% } -%>
<% if (scripts) { -%>
import {build as scripts} from './scripts';
<% } -%>
import views from './views';
import {reload} from './browser';



/**
 * ================================
 * Watch files.
 * ================================
 */

export default done => {
  // When styles update, <% if (sass) { %>compile Sass<% } else { %>copy CSS<% } %> files.
  watch(config.src.styles, styles);

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

  done();
};
