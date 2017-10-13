/*
 * (c) ECOLE POLYTECHNIQUE FEDERALE DE LAUSANNE, Switzerland, VPSI, 2017.
 * See the LICENSE file for more details.
 */

'use strict';

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request === 'getSciper') {
      var sciper  = null;
      var frameId = document.getElementById('gsft_main');
      if (frameId) {
        var frameContent = frameId.contentWindow.document.body.innerHTML;
        var regExSciper  = /"employee_number":"(\d+)"/;

        if (frameContent.match(regExSciper)) {
          var match = regExSciper.exec(frameContent);
          sciper = match[1];
        }
      }
      sendResponse(sciper);
    }
  }
);

function applyThemeOption() {
  chrome.storage.local.get('colorTheme', function(color) {
    if (!color.colorTheme) {
      color.colorTheme = 'halloween';
    }

    var link  = document.createElement('link');
    link.href = chrome.extension.getURL(
      'css/themes/' + color.colorTheme + '.css'
    );
    link.type = 'text/css';
    link.rel  = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);

  });
}

applyThemeOption();
