<% if (viewsLanguage !== 'php') { -%>
import config from '../config.js';
<% } -%>
import {getBrowserSync} from '../utilities.js';



const browserSyncInstance = getBrowserSync();



/*
 * =============================================================================
 * Create static server with live reload.
 * =============================================================================
 */

const serve = done => {
  browserSyncInstance.init({
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
  browserSyncInstance.reload();

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
