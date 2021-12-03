/*
 * Original work (c) ECOLE POLYTECHNIQUE FEDERALE DE LAUSANNE, Switzerland,
 * VPSI, 2017-2018.
 * Modified work (c) William Belle, 2018-2021.
 * See the LICENSE file for more details.
 */

'use strict';

(function () {
  var popupApp = {

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

    applyPopupTheme: function (gender) {
      document.body.classList.add(gender);
    },

    updateContent: function (sciper) {
      popupApp.getPeopleImage(sciper);
      popupApp.getPeopleInfo(sciper);
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
      var url = 'https://search-api.epfl.ch/api/ldap?q=' + sciper;
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
        document.getElementById('google-search').textContent =
          data[0].firstname + ' ' + data[0].name + ' on Google';
        document.getElementById('google-search').href =
          'https://www.google.com/search?q=' + data[0].firstname + ' ' +
          data[0].name;
        document.getElementById('social-search').textContent =
          data[0].firstname + ' ' + data[0].name + ' on Social Searcher';
        document.getElementById('social-search').href =
          'https://www.social-searcher.com/search-users/?q6=' +
          data[0].firstname + ' ' + data[0].name;
        document.getElementById('people-epfl').textContent =
          data[0].firstname + ' ' + data[0].name + ' on People';
        document.getElementById('people-epfl').href =
          'https://people.epfl.ch/' + data[0].sciper;
      }
    }
  };

  // Entry point
  popupApp.start();
})();
