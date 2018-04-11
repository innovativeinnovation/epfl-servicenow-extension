/*
 * (c) ECOLE POLYTECHNIQUE FEDERALE DE LAUSANNE, Switzerland, VPSI, 2017-2018.
 * See the LICENSE file for more details.
 */

'use strict';

module.exports = {
  build: {
    options: {
      sourcemap: 'none'
    },
    files: [{
      expand: true,
      cwd: 'src/sass',
      src: ['**/*.sass'],
      dest: 'dist/chrome/css/',
      ext: '.css'
    }, {
      expand: true,
      cwd: 'src/sass',
      src: ['**/*.sass'],
      dest: 'dist/firefox/css/',
      ext: '.css'
    }]
  }
};
