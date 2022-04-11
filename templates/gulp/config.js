const src = {};
const build = {};
const dist = {};

src.base = './src';

build.base = './build';
<% if ((typeof styles !== 'undefined' && styles) || type !== 'package' || symbols || images || fonts || scripts) { -%>
build.assets = `${build.base}/assets`;
<% } -%>

dist.base = './dist';
<% if ((typeof styles !== 'undefined' && styles) || type !== 'package' || symbols || images || fonts || scripts) { -%>
dist.assets = `${dist.base}/assets`;
<% } -%>

const config = {
  src: {
    base: `${src.base}/*`,
    <%_ if ((typeof styles !== 'undefined' && styles) || type !== 'package') { -%>
    styles: `${src.base}/styles/**/*.<% if (typeof sass !== 'undefined' && sass) { %>s+(a|c)ss<% } else { %>css<% } %>`,
    <%_ } -%>
    <%_ if (symbols) { -%>
    symbols: `${src.base}/symbols`,
    <%_ } -%>
    <%_ if (images) { -%>
    images: `${src.base}/images/**/*`,
    <%_ } -%>
    <%_ if (fonts) { -%>
    fonts: `${src.base}/fonts/**/*.woff2`,
    <%_ } -%>
    <%_ if (scripts) { -%>
    scripts: `${src.base}/scripts/**/*.js`,
    <%_ } -%>
    <%_ if (typeof views !== 'undefined' && views) { -%>
    views: `${src.base}/views/**/*.<%= views %>`,
    <%_ } -%>
    <%_ if ((typeof styles !== 'undefined' && styles) || type !== 'package' || scripts) { -%>
    vendors: {
      <%_ if ((typeof styles !== 'undefined' && styles) || type !== 'package') { -%>
      styles: {},
      <%_ } -%>
      <%_ if (scripts) { -%>
      scripts: {},
      <%_ } -%>
    },
    <%_ } -%>
  },
  build: {
    base: build.base,
    <%_ if ((typeof styles !== 'undefined' && styles) || type !== 'package') { -%>
    styles: `${build.assets}/styles`,
    <%_ } -%>
    <%_ if (symbols || images) { -%>
    images: `${build.assets}/images`,
    <%_ } -%>
    <%_ if (fonts) { -%>
    fonts: `${build.assets}/fonts`,
    <%_ } -%>
    <%_ if (scripts) { -%>
    scripts: `${build.assets}/scripts`,
    <%_ } -%>
    <%_ if (typeof views !== 'undefined' && views) { -%>
    views: build.base,
    <%_ } -%>
    globs: {
      all: `${build.base}/**/*`,
      <%_ if ((typeof styles !== 'undefined' && styles) || type !== 'package') { -%>
      styles: `${build.assets}/**/*.css`,
      <%_ } -%>
      <%_ if (scripts) { -%>
      scripts: `${build.assets}/**/*.js`,
      <%_ } -%>
    },
  },
  dist: {
    base: dist.base,
    <%_ if ((typeof styles !== 'undefined' && styles) || type !== 'package') { -%>
    styles: dist.assets,
    <%_ } -%>
    <%_ if (scripts) { -%>
    scripts: dist.assets,
    <%_ } -%>
    globs: {
      all: `${dist.base}/**/*`,
    },
  },
};



export default config;
