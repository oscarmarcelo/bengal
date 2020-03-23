import {series, parallel} from 'gulp';

import * as styles from './tasks/styles';
<% if (symbols) { -%>
import symbols from './tasks/symbols';
<% } -%>
<% if (images) { -%>
import images from './tasks/images';
<% } -%>
<% if (fonts) { -%>
import fonts from './tasks/fonts';
<% } -%>
<% if (scripts) { -%>
import * as scripts from './tasks/scripts';
<% } -%>
import views from './tasks/views';
import copy from './tasks/copy';
<% if (type === 'website') { -%>
import deploy from './tasks/deploy';
<% } -%>
import {serve} from './tasks/browser';
import watch from './tasks/watch';



export default series(
  parallel(styles.build<% if (symbols) { %>, symbols<% } %><% if (images) { %>, images<% } %><% if (fonts) { %>, fonts<% } %><% if (scripts) { %>, scripts.build<% } %>, views),
  parallel(serve, watch)
);

export const dist = parallel(styles.dist<% if (scripts) { %>, scripts.dist<% } %>, copy);
<% if (type === 'website') { -%>

export {deploy};
<% } -%>
