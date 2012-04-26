/*
TODO
- send all or filtered notes for a territory or street
- make date for a visit editable (http://mobipick.sustainablepace.net/)
- add type "do not visit" for addresses and mark them in Address-List (red or with an icon)
- create more generic success/error message method
- ask again before delete an entity
- add date: territory last processed at
- let user delete territories
- let user delete streets 
- add filter for addresses: even/odd numbers
- add multilang for date format
- create calendar entry for a WV (how?)
- better form validation
- add icon for "male","female"
- copy address to a special list for return visits, this list will be not affected if one delete a territory
- let user edit some settings
    - reset database
    - language
    - db export / db import
*/
function JwminoController(persistencejs, $location, $route) {
    self = this;

    // load external partials to add custom buttons per panel
    self.tbButtons = './partials/tbbtn_territories.html';
    $route.onChange(function() {
        self.tbButtons = './partials/tbbtn' + $location.hashPath + '.html';
    });


    self.appConfig = {
        lang: 'de'
    };

    //self.navigate = $navigate;
    self.db = persistencejs;

    // initial load of data
    self.refreshTerritories();

    //self.saveConfig = function(config) {
    //    self.db.setAppConfig(config, function(config) {
    //        console.log(config);
    //        self.appConfig = {
    //            lang: config.lang
    //        }
    //        self.$root.$eval();
    //    });
    //};

    //var config = { lang: "de" };
    //self.saveConfig(config);

    //self.db.getAppConfig(function(config) {
    //    console.log('config',config[0]);
    //    self.appConfig = {
    //        lang: config[0].lang
    //    }
    //    self.$root.$eval();
    //});

    self.territories = [];
    self.streets = [];
    self.addresses = [{ the_visits : [] }];
    self.visits = [];

    // currently selected values
    self.curTerritory = {};
    self.curStreet = {};
    self.curAddress = {
        gender: 'na',
        type: 'na',
        age: 'na'
    };
    self.curVisit = { type: 'nh' };

    self.resetCurTerritory= function() {
        self.curTerritory= {};
    };

    self.resetCurStreet = function() {
        self.curStreet = { name: '' };
    };

    self.resetCurAddress = function() {
        self.curAddress = {
            gender: 'na',
            type: 'na',
            age: 'na'
        };
    };

    self.resetCurVisit = function() {
        self.curVisit = {
            type: 'nh'
        };
    };

    self.changeReturnVisitAddress = function() {
        console.log('checked or unchecked', self.curAddress);
    };

    self.flashmessage = '';
    self.flashmessage_navigate = '';
    self.addressFilter = 'all';
}
JwminoController.$inject = ['persistencejs','$location','$route'];

JwminoController.prototype = {
    saveAddressAndVisit: function() {
        console.log('number: ', self.curAddress.housenumber);
        this.db.createAddressAndVisit(self.curAddress ,self.curVisit, self.curStreet, function(success) {
            if(!success) {
                self.flashmessage = 'Note not saved. Empty form?';
                // FIXME self.navigate('message');
            }
            else {
                self.resetCurAddress();
                self.resetCurVisit();
                // FIXME self.navigate('notes');
            }
        });
    },

    saveVisit: function() {
        if(self.curVisit.id) {
            self.db.updateVisit(self.curVisit, function(success) {
                if(!success) {
                    self.flashmessage = 'Visit not saved. Empty form?';
                    // FIXME self.navigate('message');
                }
                else {
                    self.resetCurVisit();
                    iui.showPageById('visits');
                }
            });
        }
        else {
            self.db.createVisit(self.curVisit, self.curAddress, function(success) {
                if(!success) {
                    self.flashmessage = 'Visit not saved. Empty form?';
                    // FIXME self.navigate('message');
                }
                else {
                    self.curVisit = {};
                    iui.showPageById('notes');
                }
            });
        }
    },

    saveTerritory: function() {
        if(self.curTerritory.id) {
            self.db.updateTerritory(self.curTerritory, function(success) {
                if(!success) {
                    self.flashmessage = 'Not saved, empty form?';
                    // FIXME self.navigate('message');
                }
                else {
                    self.resetCurTerritory();
                    self.refreshTerritories();
                    // FIXME self.navigate('territories');
                }
            });
        }
        else {
            this.db.createTerritory(self.curTerritory, function(success) {
                if(!success)
                {
                    self.flashmessage = 'Territory not saved. Empty form?';
                    // FIXME self.navigate('message');
                }
                else {
                    self.resetCurTerritory();
                    // FIXME self.navigate('territories');
                }
            });
        }
    },

    saveStreet: function() {
        if(self.curStreet.id) {
            self.db.updateStreet(self.curStreet, function(success) {
                if(!success) {
                    self.flashmessage = 'Not saved, empty form?'; // FIXME
                }
                else {
                    self.curStreet = {};
                }
            });
        }
        else {
            this.db.createStreet(self.curStreet, self.curTerritory, function(success) {
                if(!success) {
                    self.flashmessage = 'Not saved, empty form?'; // FIXME
                }
                else {
                    self.curStreet = {};
                }
            });
        }
    },

    saveAddress: function() {
        if(self.curAddress.id) {
            self.db.updateAddress(self.curAddress, function(success) {
                if(!success) {
                    self.flashmessage = 'Not saved, empty form?';
                    // FIXME self.navigate('message');
                }
                else {
                    // FIXME self.navigate('visits');
                }
            });
        }
        else {
            // FIXME self.navigate('visits');
        }
    },

    refreshTerritories: function() {
        self.territories = [];
        self.db.getTerritories(function(results) {
            self.territories = results;
            self.$root.$eval();
        });
    },

    refreshStreets: function() {
        self.streets = [];
        self.db.getStreetsByTerritory(self.curTerritory, function(results) {
            self.streets = results;
            self.$root.$eval();
        });
    },

    refreshVisits: function() {
        self.refreshAddresses(self.addressFilter);
        self.$root.$eval();
    },

    refreshAddresses: function(filter) {
        var filter = filter || 'all';
        self.addressFilter = filter;
        self.addresses = [];
        self.db.getAddressesByStreet(self.curStreet, filter, function(results){
            self.addresses = angular.Array.orderBy(results, function sortNumber(a) { return parseInt(a.housenumber); }, false);
            angular.forEach(self.addresses, function(a) {
                a.the_visits  = [];
                a.visits.list(null,function(v) {
                    a.the_visits = angular.Array.orderBy(v, 'date', true);
                    self.$root.$eval();
                });
            });
        });
    },

    deleteTerritory: function() {
        var tmpTerritory = self.curTerritory;
        self.curTerritory = {};
        self.db.deleteTerritory(tmpTerritory, function(success) {
            if(success) {
                //self.refreshTerritories();
            }
        });
    },

    deleteVisit: function() {
        var tmpVisit = self.curVisit;
        self.curVisit = {};
        self.db.deleteVisit(tmpVisit, function(success) {
            if(success) {
                self.setVisits();
                self.flashmessage = angular.filter.i18n('Visit has been deleted.');
                // FIXME self.navigate('message');
                self.flashmessage_navigate = 'notes';
                //self.flashmessage_navigate = 'visits';
            }
        });
    },

    setCurTerritory: function(item) {
        self.curTerritory = item;
        //self.refreshStreets();
    },

    setCurStreet: function(item) {
        self.curStreet = item;
    },

    setCurAddress: function (item) {
        self.curAddress = item;
        self.setVisits();
    },

    setVisits: function() {
        self.curAddress.visits.list(null,function(v) {
            self.visits = angular.Array.orderBy(v, 'date', true);
        });
    },

    setCurVisit: function(item) {
        self.curVisit = item;
    },

    appReset: function() {
        self.db.reset();
    },

    exportData: function() {
        self.db.exportDb(function(data) {
            console.log(data);
            window.writeExport(data, function(res) {
                console.log(res);
            });
        });
    }

}

// Wait for PhoneGap to load
//
//document.addEventListener("deviceready", onDeviceReady, false);

//window.writeExport = function(content, cb) {
//    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
//
//    function gotFS(fileSystem) {
//        fileSystem.root.getFile("/sdcard/Android/data/com.marcomichely/exported/export.json", {create: true}, gotFileEntry, fail);
//    }
//
//    function gotFileEntry(fileEntry) {
//        fileEntry.createWriter(gotFileWriter, fail);
//    }
//
//    function gotFileWriter(writer) {
//        writer.onwrite = function(cb) {
//            console.log("write success");
//            cb('write success');
//        };
//        writer.write(content);
//    }
//
//    function fail(error) {
//        console.log(error.code);
//    }
//}
