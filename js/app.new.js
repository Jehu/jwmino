/**
 * Configure routing and URL handling
 */
ngMobile.config(function($routeProvider, $locationProvider) {
    // configure your routes to load the partials / views and bind controllers
    $routeProvider.when('/territories', { template: 'partials/territories.html', controller: TerritoriesCntl });
    $routeProvider.when('/streets', { template: 'partials/streets.html', controller: StreetsCntl });
    $routeProvider.when('/notes', { template: 'partials/notes.html', controller: NotesCntl });
    $routeProvider.when('/visits', { template: 'partials/visits.html', controller: VisitsCntl });
    $routeProvider.when('/address-filter', { template: 'partials/address-filter.html', controller: AddressFilterCntl });
    $routeProvider.when('/edit-visit', { template: 'partials/edit-visit.html', controller: EditVisitCntl });
    $routeProvider.when('/edit-note', { template: 'partials/edit-note.html', controller: EditNoteCntl });
    $routeProvider.when('/edit-territory', { template: 'partials/edit-territory.html', controller: EditTerritoryCntl });
    $routeProvider.when('/edit-street', { template: 'partials/edit-street.html', controller: EditStreetCntl });
    $routeProvider.when('/edit-address', { template: 'partials/edit-address.html', controller: EditAddressCntl });
    $routeProvider.otherwise({ template: 'partials/territories.html', controller: TerritoriesCntl });

    // this must be to get it work! dont't change if you don't know exactly what you do...
    $locationProvider.html5Mode(false).hashPrefix('');
});



/**
 * Startpage Controller
 */
function TerritoriesCntl($scope, $location, jwminoSrv) {
    var s   = $scope;
    var srv = $scope.srv = jwminoSrv;

    $scope.territories = [];
    $scope.setHeaderText('Territories');

    $scope.tmpTerritoryToDelete = undefined;

    s.confirmDeleteTerritory = function(territory) {
        if(territory != undefined) {
            s.tmpTerritoryToDelete = territory;
            s.dialogConfirm.show('Really delete Territory ' + territory.ident + ' ' + territory.city + '?', 'deleteConfirmCallback');
        }
    }

    s.confirmResetDatabase = function() {
        s.dialogConfirm.show('Really erease all data?', 'resetDatabaseConfirmCallback');
    }

    s.deleteConfirmCallback = function(answer) {
        if(answer == 'yes' && s.tmpTerritoryToDelete != undefined) {
            srv.deleteTerritory(s.tmpTerritoryToDelete);
            srv.refreshTerritories($scope);
        }
    };
    $scope.resetDatabaseConfirmCallback = function(answer) {
        if(answer == 'yes') {
            srv.appReset();
            srv.refreshTerritories($scope);
            $location.path('/');
        }
    }


    // load territories from DB
    srv.refreshTerritories($scope);
}

function StreetsCntl($scope, jwminoSrv) {
    var s = $scope;
    var srv = $scope.srv = jwminoSrv;

    $scope.streets = [];
    $scope.setHeaderText('Streets');

    // load streets from DB
    srv.refreshStreets($scope);

    s.tmpStreetToDelete = undefined; 
    $scope.confirmDeleteStreet = function(street) {
        if(street != undefined) {
            s.tmpStreetToDelete = street;
            s.dialogConfirm.show('Really delete street ' + street.name + '?', 'deleteConfirmCallback');
        }
    }

    $scope.deleteConfirmCallback = function(answer) {
        if(answer == 'yes' && s.tmpStreetToDelete != undefined) {
            srv.deleteStreet(s.tmpStreetToDelete);
            srv.refreshStreets($scope);
        }
    };
    
}

function NotesCntl($scope, jwminoSrv) {
    var s = $scope;
    var srv = $scope.srv = jwminoSrv;

    $scope.addresses = srv.addresses;
    $scope.setHeaderText('Notes');

    srv.refreshAddresses($scope);
}

function VisitsCntl($scope, jwminoSrv) {
    var s = $scope;
    var srv = $scope.srv = jwminoSrv;

    srv.refreshVisits($scope);
}

function AddressFilterCntl($scope, jwminoSrv) {}

function EditVisitCntl($scope, $location, jwminoSrv) {
    var s = $scope;
    var srv = $scope.srv = jwminoSrv;
    $scope.$location = $location;

    $scope.setHeaderText('Visit');
}

function EditNoteCntl($scope, $location, jwminoSrv) {
    var s = $scope;
    var srv = $scope.srv = jwminoSrv;
    $scope.$location = $location;
    $scope.setHeaderText('Note');
}

function EditTerritoryCntl($scope, jwminoSrv) {
    var s = $scope;
    var srv = $scope.srv = jwminoSrv;

    var headerText = (srv.curTerritory.id) ?  'Edit Territory' : 'Create Territory';
    $scope.setHeaderText(headerText);
}

function EditStreetCntl($scope, $location, jwminoSrv) {
    var s = $scope;
    var srv = $scope.srv = jwminoSrv;
    $scope.$location = $location;

    var headerText = (srv.curStreet.id) ? 'Create Street' : 'Edit Street';
}

function EditAddressCntl($scope, jwminoServ) {}

