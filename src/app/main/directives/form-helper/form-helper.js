(function ()
{
    'use strict';

    angular
        .module('app.directives')
        .directive('formHelper', formHelper);

    var controller = function($scope,$http,$rootScope){
      $scope.saveClass = 'fa-check';//check
          var ad = 1;
          $scope.ad = 1;
          //$scope.saveText = '';
          $scope.customvalidation = typeof $scope.customvalidation=='undefined'?'t':$scope.customvalidation;
          console.log('c: ' + $scope.customvalidation );
          $scope.object = $scope.object || {};
          $scope.formClass = $scope.modal ? '' : 'widgetcontent nopadding';
          $scope.changed = false;
          $scope.processFields = $scope.processFields || true;
          $scope.pfx = $scope.$parent;
          $scope.label = $rootScope.lang=='es'?'label':'label_en';
          $scope.msg = $rootScope.lang=='es'?'message':'message_en';
          //$scope.translates = $rootScope.translates;

          $scope.getFieldId = function(index,handle) {
              return ('input_field_' + handle.replace(/ /g,'_') + '_' + index);
          };

          $scope.getSaveStatusClass = function(){
              if ($scope.saveClass == 'fa-upload')
                  return;
              if ($scope.form.$dirty && !$scope.form.$invalid)
                  $scope.saveClass = 'fa-save';
              else
                  $scope.saveClass = 'fa-check';
          };
          $scope.removeRel = function(field,object){
              var data = {
                  obj : $scope.object.id,
                  rel : object.id,
              };
              //$http({method:'POST',url:field.removeAction,data:data}).success(function (obj){
              $http.post(field.removeAction,data,{}).success(function (obj){
                  $scope.object[field.handle] = obj[field.handle];
              });
          };
          $scope.save = function(){
              var submitObject =  $scope.object ? {id:$scope.object.id} : {};
              var restrictArray = $scope.restrict ? $scope.restrict.split(',') : [];
              $scope.fields.forEach(function(field){
                  var isRestricted = false;
                  for (var i in restrictArray) {
                      if (field.handle == restrictArray[i]) {
                          isRestricted = true;
                      }
                  }
                  if (!isRestricted) {
                      submitObject[field.handle] = $scope.object[field.handle];
                  }
              });
              if ($scope.hiddenFields) {
                  $scope.hiddenFields.forEach(function(field){
                      submitObject[field.key] = field.value;
                  });
              }

              $scope.saveClass = 'fa-upload';
              var saveMethod = $scope.formSave();
              if(saveMethod){
                  $scope.formSave()(submitObject,function(){
                      console.log(submitObject);
                      $scope.form.$setPristine();
                      $scope.saveClass = 'fa-check';
                      $scope.object = {};

                  });
              }else{
                  //$http({method:'POST',url:$scope.action,data:submitObject}).success(function (obj){
                  $http.post($scope.action,submitObject,{}).success(function(obj){
                      //$scope.object = object; //Se comento por error en casos donde varios formHelpers dependen de un mismo objeto.
                      console.log(submitObject);
                      $scope.form.$setPristine();
                      $scope.saveClass = 'fa-check';
                      //$scope.object = {};
                  });
              }

          };
          $scope.onChangefx = function(field){
              if( typeof field.on_Change != 'undefined' && field.on_Change ){
                  var changeMethod = $scope.onchanges[field.on_Change];
                  if(changeMethod){
                      var $this = $scope.object[field.handle];
                      changeMethod($scope.object);
                  }
              }
          }

          $scope.formFilter = function(item){
              $scope.getSaveStatusClass();//esta funcion esta aqui para que corra todo el tiempo revisando si la form ya fue modificada.
              if ($scope.restrict) {
                  var restrictArray = $scope.restrict.split(',');
                  for (var i in restrictArray) {
                      if (item.handle == restrictArray[i]) {
                          return false;
                      }
                  }
              }
              return true;
          };

          $scope.tinymceOptions = {
              resize: false
          };

          var saveMethod = $scope.formSave();
          if(!saveMethod) { //TODO esto deberia ser un if update
              $scope.$on('SAVE_ALL', function () {
                  $scope.save();
              });
          }

          $scope.fieldIsHidden = function(field){
              //console.log('test');
              var isHidden = false;
              if (field.condition) {
                  var keyValues = field.condition.split('=');
                  isHidden = $scope.object[keyValues[0]] != keyValues[1];
                  //console.log(isHidden);
              }
              return (field.hideIfNotField && !object[field.hideIfNotField] || field.hideIfField && object[field.hideIfField]) || isHidden;
          }
    };
    controller.$inject = ['$scope','$http','$rootScope'];

    /** @ngInject */
    function formHelper()
    {
      return {
          controller : controller,
              scope : {
                  object : '=',
                  onchanges : '=',
                  fields : '=',
                  action : '@',
                  formTitle : '@',
                  formFooter : '@',
                  modal : '@',
                  formSave : '&',
                  objects : '=',
                  currency : '=',
                  restrict : '@',
                  hiddenFields : '=',
                  customvalidation : '@',
                  addMethod : '@',
                  dir : '@'
        },
        templateUrl : 'app/main/directives/form-helper/form-helper.html'
      };
    }
})();
