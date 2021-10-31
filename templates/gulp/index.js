import gulp from 'gulp';

import * as styles from './tasks/styles.js';
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
import copy from './tasks/copy.js';
<% if (type === 'website') { -%>
import deploy from './tasks/deploy.js';
<% } -%>
import {serve} from './tasks/browser.js';
import watch from './tasks/watch.js';



const {series, parallel} = gulp;



export default series(
  parallel(styles.build<% if (symbols) { %>, symbols<% } %><% if (images) { %>, images<% } %><% if (fonts) { %>, fonts<% } %><% if (scripts) { %>, scripts.build<% } %>, views),
  parallel(serve, watch),
);



export const dist = parallel(styles.dist<% if (scripts) { %>, scripts.dist<% } %>, copy);
<% if (type === 'website') { -%>



export {deploy};
<% } -%>
