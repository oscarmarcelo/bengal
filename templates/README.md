# <%= project %>
<% if (description) { -%>

> <%= description %>
<% } -%>



## Requirements

- [Node.js](https://nodejs.org/en/) <%= nodeVersion %> or later;
- [Gulp CLI](https://gulpjs.com) 2.2.0 or later<% if (viewsLanguage === 'php') { -%>;<% } else { %>.<% } %>
<% if (viewsLanguage === 'php') { -%>
- [Docker](https://www.docker.com).
<% } -%>



## Installation

``` shell
npm install<% if (type === 'package') { %> <%= package %><% } %>
```
<% if (type === 'package') { -%>



## Usage

```<% if (scripts) { %> js
import <%= camelCasePackage %> from '<%= package %>';

<%= camelCasePackage %>();<% } %>
```



## API

*Coming Soon*
<% } -%>



## Development Scripts

To run a NPM script, type in the terminal `npm run` followed by one of the scripts below:

- `start`: Builds the project<% if (views) { %>, runs the local server it,<% } %> and watches for changes;
<% if (views) { -%>
- `build`: Builds the project (without running the local server), and watches for changes;
- `serve`: Runs the project's local server (without building it), and watches for changes;
<% } -%>
<% if (viewsLanguage === 'php') { -%>
- `container`: Starts the back-end server in a Docker container;
<% } -%>
- `dist`: Prepares `build` files for distribution;
<% if (type === 'website') { -%>
- `deploy`: Deploys the project using the server configurations in the `.env` file;
<% } -%>
<% if (type === 'package') { -%>
- `release`: Releases a new version and publishes the package to NPM;
<% } -%>
<% if (xo) { -%>
- `lint`: Runs linters in the code and reports their results;
<% } -%>
- `clean`: Deletes all `build` and `dist` files.



## Versioning

This project adheres to [Semantic Versioning](https://semver.org).



---

Project generated using [Bengal](https://github.com/oscarmarcelo/bengal).
