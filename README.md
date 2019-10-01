# Bengal

> A scaffolding generator for front-end projects.

Bengal is opinionated, which *might not be for everyone*, but it will be a helpful tool if your project has the following [assumptions](#assumptions).



## Assumptions


### Common to all flows

- Project contents are inside a `src` folder, which are built into a `build` folder, and distributed to a `dist` folder;
- Views:
  - Views are inside a `views` folder;
  - Rendered using Pug or PHP;
    - If using PHP, development server is composed with Docker, using Nginx as webserver;
- Styles:
  - Styles are inside a `styles` folder;
  - Preprocessed with Sass (**Optional**);
    - If using Sass, all styles are organized using the [7-1 Pattern](https://sass-guidelin.es/#the-7-1-pattern);
  - Vendor prefixes are managed by Autoprefixer;
  - Compressed when distributed;
- SVG Symbols (**Optional**):
  - Symbols are inside a `symbols` folder;
  - All symbols in the same direct folder are concatenated into a single file and named after that folder;
- Images (**Optional**):
  - Images are inside an `images` folder;
  - All PNG, JPEG, GIF, and SVG images are optimized;
- Fonts (**Optional**):
  - Fonts are inside an `fonts` folder;
- Scripts (**Optional**):
  - Scripts are inside a `scripts` folder;
  - ECMAScript 2015+ is converted using Babel (**Optional**);
  - Linted using XO (**Optional**);
  - Uglified when distributed;
- All assets are built into a common `assets` folder and organized by type using subfolders (`styles`, `images`, `scripts`...);
- Uses Gulp to manage tasks;
- Uses BrowserSync to live reload;
- Uses Git and follow GitHub standards (contribution files...);
- Uses EditorConfig;
  - 2 spaces for indentation;
  - `lf` for EOL;
  - An empty newline at the end of the file when saved;
  - Trailing whitespace trimmed when saved (except Markdown);


### *Website* flow

- All views are built into root build folder;
- The `assets` folder is also in the root build folder;
- Deploy is made to server via SSH;


### *Electron App* flow

> 🚧 **Coming soon.**



## Requirements

- [Node.js](https://nodejs.org/);
- [Yeoman](https://yeoman.io) installed globally: `npm install --global yo`;
- [Gulp](https://gulpjs.com) CLI installed globally: `npm install --global gulp-cli`;
- [XO](https://github.com/xojs/xo) installed globally (if using XO): `npm install --global xo`;
- [Docker](https://www.docker.com) (if using PHP);



## Installation

Run the following command on your terminal:
```
npm install --global generator-bengal
```


## Usage

With your terminal in your project directory, run the following command, and follow the instructions:
```
yo bengal
```

---

> Happy coding! 😼
