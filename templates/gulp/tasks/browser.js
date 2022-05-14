import {init, reload as bsReload} from 'browser-sync';
<% if (viewsLanguage !== 'php') { -%>

import config from '../config.js';
<% } -%>



/*
 * =============================================================================
 * Create static server with live reload.
 * =============================================================================
 */

const serve = done => {
  init({
    <%_ if (viewsLanguage === 'php') { -%>
    proxy: 'localhost:<%= port %>',
    <%_ } else { -%>
    server: config.build.base,
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
