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



const {series, parallel} = gulp;



export default series(
  parallel(
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
    copy.build,
    <%_ if (styles || scripts) { -%>
    copy.vendor,
    <%_ } -%>
    <%_ if (views) { -%>
    views,
    <%_ } -%>
  ),
  <%_ if (views) { -%>
  parallel(
    serve,
  <%_ } -%>
  <% if (views) { %>  <% } %>watch,
  <%_ if (views) { -%>
  ),
  <%_ } -%>
);



export const dist = parallel(
  <%_ if (styles) { -%>
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
