/**
 * Configure routing and URL handling
 */
ngMobile.config(function($routeProvider, $locationProvider) {
    // configure your routes to load the partials / views and bind controllers
    $routeProvider.when('/territories', { template: 'partials/territories.html', controller: TerritoriesCntl });
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

ngMobile.factory('jwminoServ', function() {
    return {
            
    }
});

/**
 * Startpage Controller
 */
function TerritoriesCntl($scope, jwminoServ) {
    $scope.setHeaderText('Territories');    
}
function NotesCntl($scope, jwminoServ) {}
function VisitsCntl($scope, jwminoServ) {}
function AddressFilterCntl($scope, jwminoServ) {}
function EditVisitCntl($scope, jwminoServ) {}
function EditNoteCntl($scope, jwminoServ) {}
function EditTerritoryCntl($scope, jwminoServ) {}
function EditStreetCntl($scope, jwminoServ) {}
function EditAddressCntl($scope, jwminoServ) {}

