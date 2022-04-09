<% if (symbols) { -%>
import {existsSync, statSync} from 'node:fs';
<% } -%>
import {join<% if (typeof sass !== 'undefined' && sass) { %>, basename<% } %>} from 'node:path';

<% if (symbols) { -%>
import walkSync from 'walk-sync';
<% } -%>
import slash from 'slash';



/**
 * @function path
 * @description Creates a glob compatible path.
 * @param {...string} path - The paths the be joined.
 * @return {string} The glob compatible path.
 */

export const path = (...path) =>
  slash(join(...path));
<% if (symbols) { -%>



/**
 * @function getDirs
 * @description Get directories from a path.
 * @param {string} ctx - The path context.
 * @return {array} Array of paths inside `ctx`.
 */

export const getDirs = ctx =>
  [
    '.',
    ...existsSync(ctx)
      ? walkSync(ctx).filter(dirent => statSync(path(ctx, dirent)).isDirectory())
      : [],
  ]
    .map(directory => directory.replace(/\/$/, ''));
<% } -%>
<% if (typeof sass !== 'undefined' && sass) { -%>



/**
 * @function dirToFile
 * @description Converts the path of an index file to its parent folder path.
 * @param {string} file - The file to replace its parent folder.
 */

export const dirToFile = file => {
  if (file.basename === 'index') {
    file.basename = slash(basename(file.dirname));
    file.dirname = path(file.dirname, '../');
  }
};
<% } -%>
