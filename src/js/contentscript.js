/*
 * (c) ECOLE POLYTECHNIQUE FEDERALE DE LAUSANNE, Switzerland, VPSI, 2017.
 * See the LICENSE file for more details.
 */

'use strict';

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request === 'getSciper') {
      sendResponse(getSciper());
    }
  }
);

function getSciper () {
  var sciper = null;
  var frameId = document.getElementById('gsft_main');
  if (frameId) {
    sciper = extractSciperFromTicket(
      frameId.contentWindow.document.body.innerHTML
    ) || extractSciperFromUser(frameId.contentWindow.document);
  } else {
    sciper = extractSciperFromTicket(document.body.innerHTML) ||
      extractSciperFromUser(document);
  }
  return sciper;
}

function extractSciperFromUser (doc) {
  return doc.getElementById('sys_readonly.sys_user.user_name').value;
}

function extractSciperFromTicket (content) {
  var regExSciper = /"employee_number":"(\d+)"/;

  if (content.match(regExSciper)) {
    var match = regExSciper.exec(content);
    return match[1];
  }
  return null;
}

function applyThemeOption () {
  chrome.storage.local.get('colorTheme', function (color) {
    if (!color.colorTheme) {
      color.colorTheme = 'halloween';
    }

    var link = document.createElement('link');
    link.href = chrome.extension.getURL(
      'css/themes/' + color.colorTheme + '.css'
    );
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
  });
}

applyThemeOption();
