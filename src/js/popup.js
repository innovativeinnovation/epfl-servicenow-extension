/*
 * (c) ECOLE POLYTECHNIQUE FEDERALE DE LAUSANNE, Switzerland, VPSI, 2017.
 * See the LICENSE file for more details.
 */

(function() {
  'use strict';

  var popupApp = {

    username: 'USERNAME',
    password: 'PASSWORD',

    initImgProfile: function() {
      var images = document.getElementsByClassName('img-profile');
      for (var i = 0; i < images.length; i++) {
        images[i].src = chrome.extension.getURL('images/default-profile.jpg');
      }
    },

    getSciper: function(callback) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
        if (typeof tab[0] === 'undefined') {
          setTimeout(this.getSciper(), 1000);
        } else {
          chrome.tabs.sendMessage(tab[0].id, 'getSciper', function(sciper) {
            if (typeof tab[0] === 'undefined') {
              setTimeout(this.getSciper(), 1000);
            } else {
              if (sciper) {
                callback(sciper);
              }
            }
          });
        }
      });
    },

    updateContent: function(sciper) {
      popupApp.getPeopleImage(sciper);
      popupApp.getSidInfo(sciper);
      popupApp.getPeopleInfo(sciper);
    },

    getSidImage: function(path) {
      var url = 'https://infowww.epfl.ch' + path;
      var oReq = new XMLHttpRequest();
      oReq.open('GET', url);
      oReq.addEventListener('load', function() {
        document.getElementById('sid-image').src = url;
      });
      oReq.setRequestHeader('Authorization', 'Basic ' +
        btoa(popupApp.username + ':' + popupApp.password));
      oReq.send();
    },

    getSidInfo: function(sciper) {
      var url = 'https://infowww.epfl.ch/imoniteur/Sidonl.Afficher' +
        '?px_Personne=' + sciper;
      var oReq = new XMLHttpRequest();
      oReq.addEventListener('load', function() {
        var content = this.responseText;
        var regExPhoto = /src="(\/photos\/.*)"/;
        var regExDate = /<td colspan="1">(\d{2}\.\d{2}\.\d{4})<\/a><\/td>/;
        var regExGender = /<td colspan="1">(Féminin|Masculin)<\/a><\/td>/;
        if (content.match(regExPhoto)) {
          var match = regExPhoto.exec(content);
          popupApp.getSidImage(match[1]);
        }
        if (content.match(regExDate)) {
          var dates = regExDate.exec(content);
          document.getElementById('birthdate').textContent = dates[1];
        }
        if (content.match(regExGender)) {
          var gender = regExGender.exec(content);
          if (gender[1] === 'Féminin') {
            document.body.classList.add('girl');
            document.getElementById('people-image').src =
              chrome.extension.getURL('images/default-girl.jpg');
          } else {
            document.body.classList.add('boy');
            document.getElementById('people-image').src =
              chrome.extension.getURL('images/default-boy.jpg');
          }
        }
      });
      oReq.open('GET', url);
      oReq.setRequestHeader('Authorization', 'Basic ' +
        btoa(popupApp.username + ':' + popupApp.password));
      oReq.send();
    },

    getPeopleImage: function(sciper) {
      var url = 'https://people.epfl.ch/cgi-bin/people/getPhoto?id=' + sciper;
      var oReq = new XMLHttpRequest();
      oReq.addEventListener('load', function() {
        var contentType = oReq.getResponseHeader('Content-Type');
        if (contentType === 'image/jpeg') {
          document.getElementById('people-image').src = url;
        }
      });
      oReq.open('GET', url);
      oReq.send();
    },

    getPeopleInfo: function(sciper) {
      var url = 'https://search.epfl.ch/json/ws_search.action?q=' + sciper;
      var oReq = new XMLHttpRequest();
      oReq.addEventListener('load', function() {
        var data = JSON.parse(this.responseText);
        document.getElementById('name').textContent =
          data[0].firstname + ' ' + data[0].name;
      });
      oReq.open('GET', url);
      oReq.send();
    },

    initialize: function() {
      this.initImgProfile();
      this.getSciper(this.updateContent);
    },

  };

  popupApp.initialize();
})();
