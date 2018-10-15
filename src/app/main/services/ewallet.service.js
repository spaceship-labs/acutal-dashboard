(function() {
  'use strict';

  angular.module('app.services').factory('ewalletService', ewalletService);

  /** @ngInject */
  function ewalletService($http, api) {
    var service = {
      update: update,
      find: find,
      create: create,
      getList: getList,
      getRecordsList: getRecordsList,
    };

    return service;

    function create(params) {
      var url = '/ewalletconfiguration';
      return api.$http.post(url, params);
    }

    function update(id, params) {
      var url = '/ewalletconfiguration/' + id;
      return api.$http.post(url, params);
    }

    function find() {
      var url = '/ewalletconfiguration/';
      return api.$http.get(url);
    }

    function getList(page, params) {
      var p = page || 1;
      var url = '/ewallet/' + p;
      return api.$http.post(url, params);
    }

    function getRecordsList(page, params) {
      var p = page || 1;
      var url = '/ewalletrecord/' + p;
      return api.$http.post(url, params);
    }
  }
})();
