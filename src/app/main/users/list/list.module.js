(function ()
{
    'use strict';

    angular
        .module('app.users.list', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.users_list', {
            url  : '/users',
            views: {
                'content@app': {
                    templateUrl: 'app/main/users/list/list.html',
                    controller : 'ProductsListController as vm'
                }
            },
            resolve: {
                Users: function (apiResolver)
                {
                    //return [];
                    return apiResolver.resolve('user.find@get');
                }
            },
        });
    }

})();
