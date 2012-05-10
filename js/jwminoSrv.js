ngMobile.factory('jwminoSrv', ['db', function(db) {
    return {
        getDb: function() { return db }
        ,visits: []
        ,addresses: []
        ,addressFilter: 'all'
        ,curTerritory: {}
        ,curStreet: {}
        ,curAddress: {
            gender: 'na',
            type: 'na',
            age: 'na'
        }
        ,curVisit: {
            type: 'nh'    
        }
        ,resetCurTerritory: function() {
            this.curTerritory= {};
        }
        ,resetCurStreet: function() {
            this.curStreet = { name: '' };
        }
        ,resetCurAddress: function() {
            this.curAddress = {
                gender: 'na',
                type: 'na',
                age: 'na'
            };
        }
        ,resetCurVisit: function() {
            this.curVisit = {
                type: 'nh'
            };
        }
        ,saveAddressAndVisit: function() {
            var that = this;
            db.createAddressAndVisit(this.curAddress ,this.curVisit, this.curStreet, function(success) {
                if(!success) {
                }
                else {
                    that.resetCurAddress();
                    that.resetCurVisit();
                }
            });
        }
        ,saveVisit: function() {
            var that = this;
            if(this.curVisit.id) {
                db.updateVisit(this.curVisit, function(success) {
                    if(!success) {
                    }
                    else {
                        that.resetCurVisit();
                        that.refreshVisits();
                    }
                });
            }
            else {
                db.createVisit(this.curVisit, this.curAddress, function(success) {
                    if(!success) {
                    }
                    else {
                        that.resetCurVisit();
                        that.refreshVisits();
                    }
                });
            }
        }
        ,saveTerritory: function(territiry) {
            var territory = territory || this.curTerritory;
            if(territory.id) {
                db.updateTerritory(territory, function(success) {
                    if(!success) {
                    }
                    else {
                        //this.resetCurTerritory();
                        //this.refreshTerritories();
                    }
                });
            }
            else {
                db.createTerritory(territory, function(success) {
                    if(!success)
                    {
                    }
                    else {
                        //this.resetCurTerritory();
                    }
                });
            }
        }
        ,saveStreet: function() {
            var that = this;
            if(this.curStreet.id) {
                db.updateStreet(this.curStreet, function(success) {
                    if(!success) {
                    }
                    else {
                        that.resetCurStreet();
                    }
                });
            }
            else {
                db.createStreet(this.curStreet, this.curTerritory, function(success) {
                    if(!success) {
                    }
                    else {
                        that.resetCurStreet();
                    }
                });
            }
        }
        ,saveAddress: function() {
            if(this.curAddress.id) {
                db.updateAddress(this.curAddress, function(success) {
                    if(!success) {
                    }
                    else {
                    }
                });
            }
            else {
            }
        }
        ,refreshTerritories: function(scope) {
            db.getTerritories(function(results) {
                scope.$apply(function() {
                    scope.territories = results;
                });
            });
        }
        ,refreshStreets: function(scope) {
            db.getStreetsByTerritory(this.curTerritory, function(results) {
                scope.$apply(function() {
                    scope.streets = results;
                });
            });
        }
        ,refreshVisits: function(scope) {
            this.refreshAddresses(scope, this.addressFilter);
        }
        ,refreshAddresses: function(scope, filter) {
            var scope = scope || undefined;
            if(!scope) {
                return;
            }
            var filter = filter || 'all';
            var addresses = [];
            this.addressFilter = filter;
            db.getAddressesByStreet(this.curStreet, filter, function(results){
                // sort addresses by housenumber
                addresses = _.sortBy(results, function sortNumber(a) { return parseInt(a.housenumber); });
                // sort the visits
                angular.forEach(addresses, function(a) {
                    a.the_visits  = [];
                    a.visits.list(null,function(v) {
                        a.the_visits = _.sortBy(v, 'date').reverse();
                        scope.$apply(function() {
                            scope.addresses = addresses;
                        });
                    });
                });
            });
        }
        ,deleteStreet: function(item , cb) {
            var tmpStreet = item || this.curStreet;
            var cb = cb || function() {}; 
            this.curTerritory = {};
            db.deleteStreet(tmpStreet, function(success) {
                cb(true);
            });
        }
        ,deleteTerritory: function(territory, cb) {
            var tmpTerritory = territory || this.curTerritory;
            var cb = cb || function() {}; 
            this.curTerritory = {};
            db.deleteTerritory(tmpTerritory, function(success) {
                cb(true);
            });
        }
        ,deleteVisit: function() {
            var tmpVisit = this.curVisit;
            var that = this;
            this.curVisit = {};
            db.deleteVisit(tmpVisit, function(success) {
                if(success) {
                    that.setVisits();
                }
            });
        }
        ,setCurTerritory: function(item) {
            this.curTerritory = item;
        }
        ,setCurStreet: function(item) {
            this.curStreet = item;
        }
        ,setCurAddress: function (item) {
            this.curAddress = item;
            this.setVisits();
        }
        ,setVisits: function() {
            var that = this;
            this.curAddress.visits.list(null,function(v) {
                that.visits = _.sortBy(v, 'date').reverse();
            });
        }
        ,setCurVisit: function(item) {
            console.log(item);
            this.curVisit = item;
        }
        ,appReset: function() {
            db.reset();
        }
        ,exportData: function() {
            db.exportDb(function(data) {
                console.log(data);
                window.writeExport(data, function(res) {
                    console.log(res);
                });
            });
        }
    }
}]);
