(function ()
{
    'use strict';

    angular
        .module('app.products.list')
        .controller('ProductsListController', ProductsListController);

    /** @ngInject */
    function ProductsListController(Users)
    {
        var vm = this;

        // Data
        console.log(Users);
        console.log(Users.query);
        vm.employees = Users;
        console.log(vm.employees);

        vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth : false,
            responsive: true
        };
        // Methods

        //////////
    }

})();
