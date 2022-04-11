import {init, reload as bsReload} from 'browser-sync';
<% if (views === 'pug') { -%>

import config from '../config.js';
<% } -%>



/*
 * =============================================================================
 * Create static server with live reload.
 * =============================================================================
 */

const serve = done => {
  init({
    <%_ if (views === 'pug') { -%>
    server: config.build.base,
    <%_ } -%>
    <%_ if (views === 'php') { -%>
    proxy: 'localhost:<%= port %>',
    <%_ } -%>
    ghostMode: false,
  });

  done();
};



/*
 * =============================================================================
 * Reload browser.
 * =============================================================================
 */

const reload = done => {
  bsReload();

  done();
};



/*
 * =============================================================================
 * Exports
 * =============================================================================
 */

export {
  serve,
  reload,
};
