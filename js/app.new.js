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
    $routeProvider.otherwise({ redirectTo: '/territories' });

    // this must be to get it work! dont't change if you don't know exactly what you do...
    // see https://groups.google.com/d/topic/angular/FUPnNj7CwhY/discussion
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

    s.redirectToEdit = function(item) {
        srv.setCurTerritory(item);
        $location.url('/edit-territory');
    }

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

function StreetsCntl($scope, $location, jwminoSrv, $defer) {
    var s = $scope;
    var srv = $scope.srv = jwminoSrv;
    var db = srv.getDb();
    $scope.$location = $location;

    $scope.streets = [];
    $scope.addresses = [];
    $scope.addressInfos = [];

    $scope.setHeaderText('Streets');

    // load streets from DB
    srv.refreshStreets($scope);
    srv.refreshAddresses($scope);

    s.redirectToEdit = function(item) {
        srv.setCurStreet(item);
        $location.url('/edit-street');
    }

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
            srv.refreshAddresses($scope);
            s.tmpStreetToDelete = undefined;
        }
    };
    
    $scope.addressInfos = [];

    s.getAddrCount = function(index) {
        s.refreshStreetInfos(index);
        $defer(function() {
            //s.$digest();
        },300);
    }

    // calculate street infos (visit types count)
    s.refreshStreetInfos = function(index) {
        var street = $scope.streets[index];
        db.getAddressesByStreet(street, 'all', function(addresses) {
                var counts = {
                    summary: 0
                    ,normal: 0
                    ,nh: 0
                    ,ra: 0
                    ,not_interested: 0
                    ,return_visit: 0
                    ,foreign_language: 0
                };
                angular.forEach(addresses, function(address) {
                    address.visits.list(null, function(visits) {
                        var the_visits = _.sortBy(visits, 'date').reverse();
                        var visit = the_visits[0];
                        if(visit != undefined) {
                            counts[visit.type] = counts[visit.type]+1;
                            counts.summary = counts.summary+1;
                        }
                    });
                });
                $scope.addressInfos.push({ id: street.id, addrCounts: counts});
        });
    }
}

function NotesCntl($scope, $location, jwminoSrv) {
    var s = $scope;
    var srv = $scope.srv = jwminoSrv;
    var db = srv.getDb();

    //$scope.addresses = srv.addresses;
    $scope.setHeaderText('Notes');

    srv.refreshAddresses($scope);

    $scope.confirmDeleteAddress = function(item) {
        if(item != undefined) {
            s.tmpAddressToDelete= item;
            s.dialogConfirm.show('Really delete address ' + item.housenumber + ', ' + item.name + '?', 'deleteConfirmCallback');
        }
    }

    $scope.deleteConfirmCallback = function(answer) {
        if(answer == 'yes' && s.tmpAddressToDelete != undefined) {
            srv.deleteAddress(s.tmpAddressToDelete);
            srv.refreshAddresses($scope);
            s.tmpAddressToDelete = undefined;
        }
    };

    $scope.redirectToEdit = function(item) {
        db.getAddressById(item.id, function(result) {
            jwminoSrv.setCurAddress(result);
            $location.path('/edit-address');
        });
    }
}

function VisitsCntl($scope, jwminoSrv) {
    var s = $scope;
    var srv = $scope.srv = jwminoSrv;

    srv.refreshVisits($scope);

    $scope.confirmDeleteVisit = function(item) {
        if(item != undefined) {
            s.tmpVisitToDelete = item;
            s.dialogConfirm.show('Really delete this visit?', 'deleteConfirmCallback');
        }
    }

    $scope.deleteConfirmCallback = function(answer) {
        if(answer == 'yes' && s.tmpVisitToDelete != undefined) {
            srv.deleteVisit(s.tmpVisitToDelete);
            srv.refreshVisits($scope);
            s.tmpVisitToDelete = undefined;
        }
    };
}

function AddressFilterCntl($scope, jwminoSrv) {}

function EditVisitCntl($scope, $location, jwminoSrv) {
    var s = $scope;
    var srv = $scope.srv = jwminoSrv;
    $scope.$location = $location;
    $scope.curVisit = jwminoSrv.curVisit;
    
    $scope.setHeaderText('Visit');
    //$scope.dataVisitTypeSelect = [
    //    {"key": "nh", "value": "NH"},
    //    {"key": "normal", "value": "Normal visit"},
    //    {"key": "ra", "value": "Re-audition"},
    //    {"key": "not_interested", "value": "Not interested"},
    //    {"key": "return_visit", "value": "Return visit"},
    //    {"key": "foreign_language", "value": "foreign lang."}
    //];

}

function EditNoteCntl($scope, $location, jwminoSrv) {
    var s = $scope;
    var srv = $scope.srv = jwminoSrv;
    $scope.$location = $location;
    srv.resetCurVisit();
    srv.resetCurAddress();
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

function EditAddressCntl($scope, $location, jwminoSrv) {
    var s = $scope;
    var srv = $scope.srv = jwminoSrv;
    $scope.$location = $location;
    $scope.setHeaderText('Edit Address');
    $scope.curAddress = jwminoSrv.curAddress;
}

