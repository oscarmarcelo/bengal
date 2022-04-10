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
<% if (typeof views !== 'undefined' && views) { -%>
import views from './views.js';
<% } -%>
import {build as copy} from './copy.js';
<% if (typeof views !== 'undefined' && views) { -%>
import {reload} from './browser.js';
<% } -%>



const {watch<% if (typeof views !== 'undefined' && views) { %>, series<% } %>} = gulp;



/*
 * =============================================================================
 * Watch files.
 * =============================================================================
 */

const build = done => {
  <%_ if ((typeof styles !== 'undefined' && styles) || type !== 'package') { -%>
  // When styles update, <% if (typeof sass !== 'undefined' && sass) { %>compile Sass<% } else { %>copy CSS<% } %> files.
  watch(config.src.styles, styles);

  <%_ } -%>
  <%_ if (symbols) { -%>
  // When symbols update, compile symbols and reload browser.
  watch(config.src.symbols, <% if (typeof views !== 'undefined' && views) { %>series(<% } %>symbols<% if (typeof views !== 'undefined' && views) { %>, reload)<% } %>);

  <%_ } -%>
  <%_ if (images) { -%>
  // When images update, optimize images and reload browser.
  watch(config.src.images, <% if (typeof views !== 'undefined' && views) { %>series(<% } %>images<% if (typeof views !== 'undefined' && views) { %>, reload)<% } %>);

  <%_ } -%>
  <%_ if (fonts) { -%>
  // When fonts update, copy fonts.
  watch(config.src.fonts, fonts);

  <%_ } -%>
  <%_ if (scripts) { -%>
  // When scripts update, compile scripts and reload browser.
  watch(config.src.scripts, <% if (typeof views !== 'undefined' && views) { %>series(<% } %>scripts<% if (typeof views !== 'undefined' && views) { %>, reload)<% } %>);

  <%_ } -%>
  <%_ if (typeof views !== 'undefined' && views) { -%>
  // When views update, <% if (views === 'pug') { %>compile<% } else { %>copy<% } %> views and reload browser.
  watch(config.src.views, <% if (typeof views !== 'undefined' && views) { %>series(<% } %>views<% if (typeof views !== 'undefined' && views) { %>, reload)<% } %>);

  <%_ } -%>
  // When static files in the root update, copy them.
  watch(config.src.base, <% if (typeof views !== 'undefined' && views) { %>series(<% } %>copy<% if (typeof views !== 'undefined' && views) { %>, reload)<% } %>);

  done();
};



export default build;
