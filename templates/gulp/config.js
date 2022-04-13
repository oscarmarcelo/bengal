const src = {};
const build = {};
const dist = {};

src.base = './src';

build.base = './build';
<% if (styles || symbols || images || fonts || scripts) { -%>
build.assets = `${build.base}/assets`;
<% } -%>

dist.base = './dist';
<% if (styles || symbols || images || fonts || scripts) { -%>
dist.assets = `${dist.base}/assets`;
<% } -%>

const config = {
  src: {
    base: `${src.base}/*`,
    <%_ if (styles) { -%>
    styles: `${src.base}/styles/**/*.<% if (sass) { %>s+(a|c)ss<% } else { %>css<% } %>`,
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
    <%_ if (views) { -%>
    views: `${src.base}/views/**/*.<%= views %>`,
    <%_ } -%>
    <%_ if (styles || scripts) { -%>
    vendors: {
      <%_ if (styles) { -%>
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
    <%_ if (styles) { -%>
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
    <%_ if (views) { -%>
    views: build.base,
    <%_ } -%>
    globs: {
      all: `${build.base}/**/*`,
      <%_ if (styles) { -%>
      styles: `${build.assets}/**/*.css`,
      <%_ } -%>
      <%_ if (scripts) { -%>
      scripts: `${build.assets}/**/*.js`,
      <%_ } -%>
    },
  },
  dist: {
    base: dist.base,
    <%_ if (styles) { -%>
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
