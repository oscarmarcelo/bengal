import gulp from 'gulp';

<% if (styles) { -%>
import * as styles from './tasks/styles.js';
<% } -%>
<% if (symbols) { -%>
import symbols from './tasks/symbols.js';
<% } -%>
<% if (images) { -%>
import images from './tasks/images.js';
<% } -%>
<% if (fonts) { -%>
import fonts from './tasks/fonts.js';
<% } -%>
<% if (scripts) { -%>
import * as scripts from './tasks/scripts.js';
<% } -%>
<% if (views) { -%>
import views from './tasks/views.js';
<% } -%>
import * as copy from './tasks/copy.js';
<% if (views) { -%>
import {serve} from './tasks/browser.js';
<% } -%>
import watch from './tasks/watch.js';



const {series<% if ([styles, symbols, images, fonts, scripts, views].filter(task => task).length > 0) { %>, parallel<% } %>} = gulp;



/*
 * =============================================================================
 * Tasks
 * =============================================================================
 */
<% if ([styles, symbols, images, fonts, scripts, views].filter(task => task).length > 0) { -%>

const build = parallel(
  <%_ if (styles) { -%>
  styles.build,
  <%_ } -%>
  <%_ if (symbols) { -%>
  symbols,
  <%_ } -%>
  <%_ if (images) { -%>
  images,
  <%_ } -%>
  <%_ if (fonts) { -%>
  fonts,
  <%_ } -%>
  <%_ if (scripts) { -%>
  scripts.build,
  <%_ } -%>
  <%_ if (views) { -%>
  views,
  <%_ } -%>
  copy.build,
  <%_ if (styles || scripts) { -%>
  copy.vendor,
  <%_ } -%>
);
<% } -%>

const defaultTask = series(
  <%_ if ([styles, symbols, images, fonts, scripts, views].filter(task => task).length > 0) { -%>
  build,
  <%_ } else { -%>
  copy.build,
  <%_ } -%>
  <%_ if (views) { -%>
  parallel(
    serve,
  <%_ } -%>
  <% if (views) { %>  <% } %>watch,
  <%_ if (views) { -%>
  ),
  <%_ } -%>
);
<%_ if (views) { -%>

const buildTask = series(
  build,
  watch,
);

const serveTask = parallel(
  serve,
  watch,
);
<% } -%>
<% if ([styles, scripts].filter(task => task).length > 0) { -%>

const distTask = parallel(
  <%_ if (styles) { -%>
  styles.dist,
  <%_ } -%>
  <%_ if (scripts) { -%>
  scripts.dist,
  <%_ } -%>
  copy.dist,
);
<% } else { -%>

const distTask = copy.dist;
<% }-%>



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

<% if ([styles, scripts].filter(task => task).length === 0) { -%>
distTask.displayName = 'dist';

<% }-%>
export {
  defaultTask as default,
  <%_ if (views) { -%>
  buildTask as build,
  serveTask as serve,
  <%_ } -%>
  distTask as dist,
};
<% if (type === 'website') { -%>

export {default as deploy} from './tasks/deploy.js';
<% } -%>

export {default as clean} from './tasks/clean.js';
