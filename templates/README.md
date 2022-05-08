# <%= project %>

> <%= description %>



## Requirements

- [Node.js](https://nodejs.org/en/) <%= nodeVersion %> or later;
- [Gulp CLI](https://gulpjs.com) 2.2.0 or later<% if (views === 'php') { -%>;<% } else { %>.<% } %>
<% if (views === 'php') { -%>
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

- `start`: Builds the project<% if (viewsTask) { %>, serves it,<% } %> and watches for changes;
<% if (viewsTask) { -%>
- `build`: Builds the project (without serving it), and watches for changes;
- `serve`: Serves the project (without building it), and watches for changes;
<% } -%>
<% if (views === 'php') { -%>
- `container`: Starts the back-end server in a Docker container;
<% } -%>
- `dist`: Prepares `build` files for distribution;
<% if (type === 'website') { -%>
- `deploy`: Deploys the project using the server configurations in the `.env` file;
<% } -%>
<% if (xo) { -%>
- `lint`: Runs linters in the code and reports their results;
<% } -%>
- `clean`: Deletes all `build` and `dist` files.



## Versioning

This project adheres to [Semantic Versioning](https://semver.org).
