(function ()
{
    'use strict';

    angular
        .module('app.commissions.edit')
        .controller(
          'CommissionsCreateController',
          CommissionsCreateController
        );

      function CommissionsCreateController(
        $scope,
        $mdDialog,
        dialogService,
        userService,
        roleService,
        goalService,
        companyService
      ){
        var vm            = this;
        vm.isLoading      = false;
        vm.goals          = [{}];
        vm.commissions    = undefined;
        vm.getSellers     = getSellers;
        vm.selectDate     = selectDate;
        vm.sendForm       = sendForm;
        vm.addEntry       = addEntry;
        vm.removeEntry    = removeEntry;
        vm.showCommission = showCommission;
        activate();

        function activate() {
          roleService.getRoles().then(function(res) {
            vm.roles = res.data;
          });
          companyService.getAllCompanies().then(function(companies) {
            vm.companies = companies;
          });
        }

        function getSellers(index, company) {
          companyService.countSellersGeneral(company).then(function(sellers) {
            vm.goals[index].sellers = sellers;
          });
          companyService.countSellersProject(company).then(function(sellers) {
            vm.goals[index].sellersProject = sellers;
          });
        }

        function selectDate(index, date) {
          var date = new Date(date._d);
          var y    = date.getFullYear();
          var m    = date.getMonth();
          vm.goals[index].date = new Date(y, m, 1);
        }

        function addEntry() {
          vm.goals = vm.goals.concat({});
        }

        function removeEntry(index) {
          vm.goals = vm.goals.filter(function(entry, _index) {
            return _index != index;
          });
        }

        function showCommission(goal) {
          var table = {
            parent: angular.element(document.body),
            templateUrl: 'app/main/commissions/create/dialogTable.html',
            controller: function($scope) {
              $scope.goal = goal;
            },
            clickOutsideToClose: true
          };
          $mdDialog.show(table);
        }

        function sendForm(valid) {
          if (!valid || vm.isLoading) {
            return;
          }
          goalService
            .create(vm.goals)
            .then(function(res){
              showConfirm();
              $scope
                .basicForm
                .$submitted = false;
              vm.goal       = {};
              vm.isLoading  = false;
            }).
            catch(function(err) {
              showError();
              vm.isLoading = false;
            });
        }

        function showConfirm(){
          var alert = $mdDialog.alert({
            title: 'Comisión',
            textContent: 'Datos guardados exitosamente',
            ok: 'Close'
          });
          $mdDialog.show(alert);
        }

        function showError() {
           var alert = $mdDialog.alert({
            title: 'Comisión',
            textContent: 'Hubo un problema, reintente más tarde',
            ok: 'Close'
          });
          $mdDialog.show(alert);
        }
    }
})();
