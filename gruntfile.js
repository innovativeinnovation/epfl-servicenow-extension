/*
 * Original work (c) ECOLE POLYTECHNIQUE FEDERALE DE LAUSANNE, Switzerland,
 * VPSI, 2017-2018.
 * Modified work (c) William Belle, 2018-2020.
 * See the LICENSE file for more details.
 */

'use strict';

module.exports = function (grunt) {
  require('load-grunt-config')(grunt, {
    data: {
      secret: grunt.file.readJSON('secret.json')
    }
  });
};
