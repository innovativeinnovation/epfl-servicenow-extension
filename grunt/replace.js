/*
 * Original work (c) ECOLE POLYTECHNIQUE FEDERALE DE LAUSANNE, Switzerland,
 * VPSI, 2017-2018.
 * Modified work (c) William Belle, 2018.
 * See the LICENSE file for more details.
 */

'use strict';

module.exports = {
  build: {
    options: {
      patterns: [{
        match: /USERNAME/g,
        replacement: '<%= secret.username %>'
      }, {
        match: /PASSWORD/g,
        replacement: '<%= secret.password %>'
      }]
    },
    files: [{
      expand: true,
      flatten: true,
      src: ['src/js/popup.js'],
      dest: 'dist/chrome/js/'
    }, {
      expand: true,
      flatten: true,
      src: ['src/js/popup.js'],
      dest: 'dist/firefox/js/'
    }]
  }
};
