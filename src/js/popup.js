/*
 * Original work (c) ECOLE POLYTECHNIQUE FEDERALE DE LAUSANNE, Switzerland,
 * VPSI, 2017-2018.
 * Modified work (c) William Belle, 2018-2019.
 * See the LICENSE file for more details.
 */

'use strict';

(function () {
  var popupApp = {

    username: 'USERNAME',
    password: 'PASSWORD',

    start: function () {
      this.initImgProfile();
      this.getSciper(this.updateContent);
    },

    initImgProfile: function () {
      var images = document.getElementsByClassName('img-profile');
      for (var i = 0; i < images.length; i++) {
        images[i].src = chrome.extension.getURL('images/default-profile.jpg');
      }
    },

    getSciper: function (callback) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        if (typeof tab[0] === 'undefined') {
          setTimeout(this.getSciper(), 1000);
        } else {
          chrome.tabs.sendMessage(tab[0].id, 'getSciper', function (sciper) {
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

    updateSidImageOnError: function () {
      document.getElementById('sid-image').src =
        chrome.extension.getURL('images/no-photo.jpg');
    },

    applyPopupTheme: function (gender) {
      document.body.classList.add(gender);
    },

    updateContent: function (sciper) {
      popupApp.getPeopleImage(sciper);
      popupApp.getSidInfo(sciper);
      popupApp.getPeopleInfo(sciper);
    },

    calculateYears: function (birthdate) {
      var datePart = birthdate.split('.');
      var date1 = new Date(datePart[2], datePart[1] - 1, datePart[0]);
      var date2 = new Date();
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      return Math.floor(timeDiff / (1000 * 3600 * 24 * 365.2425));
    },

    getSidImage: function (path) {
      var url = 'https://infowww.epfl.ch' + path;
      var oReq = new XMLHttpRequest();
      oReq.open('GET', url);
      oReq.addEventListener('load', function () {
        var status = oReq.status;
        if (status === 200) {
          document.getElementById('sid-image').src = url;
        } else {
          popupApp.updateSidImageOnError();
          popupApp.applyPopupTheme('neutral');
        }
      });
      oReq.setRequestHeader('Authorization', 'Basic ' +
        btoa(popupApp.username + ':' + popupApp.password));
      oReq.send();
    },

    getSidInfo: function (sciper) {
      var url = 'https://infowww.epfl.ch/imoniteur/Sidonl.Afficher' +
        '?px_Personne=' + sciper;
      var oReq = new XMLHttpRequest();
      oReq.timeout = 2000;
      oReq.addEventListener('load', function () {
        var content = this.responseText;
        var gender = '';
        var regExPhoto = /src="(\/photos\/.*)"/;
        var regExDate = /<td colspan="1">(\d{2}\.\d{2}\.\d{4})<\/a><\/td>/;
        var regExGender = /<td colspan="1">(Féminin|Masculin)<\/a><\/td>/;
        if (content.match(regExGender)) {
          gender = regExGender.exec(content);
          if (gender[1] === 'Féminin') {
            popupApp.applyPopupTheme('girl');
          } else {
            popupApp.applyPopupTheme('boy');
          }
        }
        if (content.match(regExPhoto)) {
          var match = regExPhoto.exec(content);
          popupApp.getSidImage(match[1]);
        } else {
          popupApp.updateSidImageOnError();
          if (gender === '') {
            popupApp.applyPopupTheme('neutral');
          }
        }
        if (content.match(regExDate)) {
          var dates = regExDate.exec(content);
          document.getElementById('birthdate').textContent =
            popupApp.calculateYears(dates[1]) + ' years (' + dates[1] + ')';
        }
      });
      oReq.addEventListener('error', function () {
        popupApp.updateSidImageOnError();
        popupApp.applyPopupTheme('neutral');
      });
      oReq.addEventListener('timeout', function () {
        popupApp.updateSidImageOnError();
        popupApp.applyPopupTheme('neutral');
      });
      oReq.open('GET', url);
      oReq.setRequestHeader('Authorization', 'Basic ' +
        btoa(popupApp.username + ':' + popupApp.password));
      oReq.send();
    },

    getPeopleImage: function (sciper) {
      var url = 'https://people.epfl.ch/private/common/photos/links/' +
        sciper + '.jpg';
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function () {
        popupApp.onPeopleImage(xhr, url);
      });
      xhr.open('GET', url);
      xhr.send();
    },

    onPeopleImage: function (xhr, url) {
      var status = xhr.status;
      if (status === 200) {
        document.getElementById('people-image').src = url;
      } else {
        document.getElementById('people-image').src =
          chrome.extension.getURL('images/no-photo.jpg');
      }
    },

    getPeopleInfo: function (sciper) {
      var url = 'https://search.epfl.ch/json/ws_search.action?q=' + sciper;
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', popupApp.onPeopleInfo);
      xhr.open('GET', url);
      xhr.send();
    },

    onPeopleInfo: function () {
      var data = JSON.parse(this.responseText);
      if (data[0] && data[0].firstname && data[0].name) {
        document.getElementById('name').textContent =
          data[0].firstname + ' ' + data[0].name;
      }
    }
  };

  // Entry point
  popupApp.start();
})();
