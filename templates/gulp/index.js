import gulp from 'gulp';

<% if ((typeof styles !== 'undefined' && styles) || type !== 'package') { -%>
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
import views from './tasks/views.js';
import * as copy from './tasks/copy.js';
import {serve} from './tasks/browser.js';
import watch from './tasks/watch.js';



const {series, parallel} = gulp;



export default series(
  parallel(
    <%_ if ((typeof styles !== 'undefined' && styles) || type !== 'package') { -%>
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
    copy.build,
    <%_ if ((typeof styles !== 'undefined' && styles) || type !== 'package' || scripts) { -%>
    copy.vendor,
    <%_ } -%>
    views,
  ),
  parallel(
    serve,
    watch,
  ),
);



export const dist = parallel(
  <%_ if ((typeof styles !== 'undefined' && styles) || type !== 'package') { -%>
  styles.dist,
  <%_ } -%>
  <%_ if (scripts) { -%>
  scripts.dist,
  <%_ } -%>
  copy.dist,
);
<% if (type === 'website') { -%>



export {default as deploy} from './tasks/deploy.js';
<% } -%>
