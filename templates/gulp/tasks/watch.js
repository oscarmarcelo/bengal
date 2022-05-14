import gulp from 'gulp';

import config from '../config.js';

<% if (styles) { -%>
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
<% if (views) { -%>
import views from './views.js';
<% } -%>
import {build as copy} from './copy.js';
<% if (views) { -%>
import {reload} from './browser.js';
<% } -%>



const {watch<% if (views) { %>, series<% } %>} = gulp;



/*
 * =============================================================================
 * Watch files.
 * =============================================================================
 */

const build = done => {
  <%_ if (styles) { -%>
  // When styles update, <% if (sass) { %>compile Sass<% } else { %>copy CSS<% } %> files.
  watch(config.src.styles, styles);

  <%_ } -%>
  <%_ if (symbols) { -%>
  // When symbols update, compile symbols and reload browser.
  watch(config.src.symbols, <% if (views) { %>series(<% } %>symbols<% if (views) { %>, reload)<% } %>);

  <%_ } -%>
  <%_ if (images) { -%>
  // When images update, optimize images and reload browser.
  watch(config.src.images, <% if (views) { %>series(<% } %>images<% if (views) { %>, reload)<% } %>);

  <%_ } -%>
  <%_ if (fonts) { -%>
  // When fonts update, copy fonts.
  watch(config.src.fonts, fonts);

  <%_ } -%>
  <%_ if (scripts) { -%>
  // When scripts update, compile scripts and reload browser.
  watch(config.src.scripts, <% if (views) { %>series(<% } %>scripts<% if (views) { %>, reload)<% } %>);

  <%_ } -%>
  <%_ if (views) { -%>
  // When views update, <% if (viewsLanguage === 'pug') { %>compile<% } else { %>copy<% } %> views and reload browser.
  watch(config.src.views, <% if (views) { %>series(<% } %>views<% if (views) { %>, reload)<% } %>);

  <%_ } -%>
  // When static files in the root update, copy them.
  watch(config.src.base, <% if (views) { %>series(<% } %>copy<% if (views) { %>, reload)<% } %>);

  done();
};



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

build.displayName = 'watch';

export default build;
