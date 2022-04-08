/*
 * Original work (c) ECOLE POLYTECHNIQUE FEDERALE DE LAUSANNE, Switzerland,
 * VPSI, 2017-2018.
 * Modified work (c) William Belle, 2018-2022.
 * See the LICENSE file for more details.
 */

'use strict';

module.exports = {
  options: {
    overrideConfigFile: './.eslintrc.json'
  },
  target: ['**/*.js', '!node_modules/**/*.js', '!dist/**/*.js']
};
