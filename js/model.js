angular.module('database', [], function($provide) {
    $provide.factory('db', function() {
        persistence.store.websql.config(persistence, 'jwmino', 'Database for JWMiNo', 6 * 1024 * 1024);
        persistence.debug = false;
    
        /*
         * define model
         */
        var Territory = persistence.define('Territory', {
            ident: "TEXT",
            city: "TEXT"
        });
        Territory.index('ident',{unique:true});
    
        var Street = persistence.define('Street', {
            name: "TEXT"
        });
        Street.index('name');
    
        var Address = persistence.define('Address', {
            housenumber: "INT",
            info: "TEXT",
            name: "TEXT",
            gender: "TEXT",
            age: "TEXT",
            type: "TEXT"
            //emotion: "TEXT" // this could shown by an emoticon
        });
        Address.index('housenumber');
    
        var Visit = persistence.define('Visit', {
            date: "DATE",
            note: "TEXT",
            type: "TEXT"
        });
        Visit.index('date');
    
        var AppConfig = persistence.define('AppConfig', {
            lang: "TEXT"
        });
    
        // not used yet. this could hold all return visit addresses for an extra list
        // but perhaps this is not needed, an query could list them as well (perfomance?)
        //var ReturnVisitAddress = persistence.define('ReturnVisitAddress', {
        //    territory: 'TEXT',
        //    street: 'TEXT',
        //    housenumber: 'INT',
        //    info: "TEXT",
        //    name: "TEXT"
        //});
        //ReturnVisitAddress.index('territory');
    
        /*
         * realations
         */
        Territory.hasMany('streets', Street, 'territory');
        Street.hasMany('addresses', Address, 'street');
        Address.hasMany('visits', Visit, 'address');
        //ReturnVisitAddress.hasMany('visits', Visit, 'returnvisitaddress'); // not needed yet
    
        persistence.schemaSync();
    
        /*
         * repository
         */
        return {
            createAddressAndVisit: function(editVisitAddress, editVisitNote, street, cb) {
                // FIXME add validation
                var address = new Address({
                    housenumber: parseInt(editVisitAddress.housenumber),
                    info: editVisitAddress.info,
                    name: editVisitAddress.name,
                    gender: editVisitAddress.gender,
                    age: editVisitAddress.age,
                    type: editVisitAddress.type
                });
                var visit = new Visit({
                    note: editVisitNote.note,
                    type: editVisitNote.type
                });
                visit.date = new Date();
    
                persistence.add(address);
                address.street = street.id;
                address.visits.add(visit);
    
                persistence.flush();
                cb(true);
            },
    
            createVisit: function(visit, address, cb) {
                // FIXE add validation
                var visit = new Visit({
                    note: visit.note,
                    type: visit.type,
                    date: new Date(),
                    address: address
                });
                persistence.flush();
                cb(true);
            },
    
            updateTerritory: function(territory, cb) {
                // FIXME add validation
                persistence.flush();
                cb(true);
            },
    
            updateVisit: function(visit, cb) {
                // FIXME add validation
                persistence.flush();
                cb(true);
            },
    
            updateAddress: function(address, cb) {
                // FIXME add validation
                persistence.flush();
                cb(true);
            },
    
            updateStreet: function(street, cb) {
                // FIXME add validation
                persistence.flush();
                cb(true);
            },
    
            createTerritory: function(item, cb) {
                if(!item.ident.length) {
                    cb(false);
                }
                else {
                    var territory = new Territory({
                        ident: item.ident,
                        city: item.city
                    });
                    persistence.add(territory);
                    persistence.flush();
                    cb(true);
                }
            },
    
            createStreet: function(item, territory, cb) {
                if(!item.name.length || !territory.ident)
                {
                    cb(false);
                }
                else {
                    var street = new Street({
                        name: item.name
                    });
                    persistence.add(street);
                    street.territory = territory;
                    persistence.flush();
                    cb(true);
                }
            },
    
            /*
             * Delete specified territory including all dependent data
             */
            deleteTerritory: function(item, cb) {
                // first remove all dependent data
                try {
                    item.streets.each(null, function(s) {
                        // remove all streets from this territory
                        Street.all().remove(s);
                        try {
                            s.addresses.each(null, function(a) {
                                // remove all addresses from this territory
                                //Address.all().remove(a); // Not needed - throws an error, but why???
                                try {
                                    a.visits.each(null, function(v) {
                                        // remove all visits from this territory
                                        Visit.all().remove(v);
                                    });
                                }
                                catch(err) {};
                            });
                        }
                        catch(err) {};
                    });
                    persistence.flush();
                }
                catch(err) {};

                // Finally remove territory himself
                var territories = Territory.all();
                Territory.load(item.id, function(t) {
                    territories.remove(t);

                });
                persistence.flush();
                cb(true);
            },
    
            deleteStreet: function(item, cb) {
                var collection = Territory.all();
                Street.load(item.id, function(i) {
                    collection.remove(i);
                });
                persistence.flush();
                cb(true);
            },

            deleteAddress: function(item, cb) {
                var collection = Street.all();
                Address.load(item.id, function(i) {
                    collection.remove(i);
                });
                persistence.flush();
                cb(true);
            },

            deleteVisit: function(item, cb) {
                var collection = Address.all();
                Visit.load(item.id, function(i) {
                    collection.remove(i);
                });
                persistence.flush();
                cb(true);
            },
    
            getTerritories: function(cb) {
                var allTerritories = Territory.all();
                allTerritories.list(null, cb);
            },
    
            getStreetsByTerritory: function(territory, cb) {
                var streets = Street.all().filter("territory", '=', territory.id).order('name', true);
                streets.list(null, cb);
            },
    
            getAddressById: function(id, cb) {
                Address.load(id, cb);
            },

            getStreetById: function(id, cb) {
                Street.load(id, cb);
            },

            getTerritoryById: function(id, cb) {
                Territory.load(id, cb);
            },

            getAddressesByStreet: function(street, filter, cb) {
                var addresses= Address.all().filter("street", '=', street.id).order('housenumber', true);
                if(!filter || filter == 'all') {
                    addresses.list(null, cb);
                }
                else {
                    addresses.list(null, function(items) {
                        var filtered = [];
                        angular.forEach(items, function(item) {
                            if(item.type == filter) {
                                filtered.push(item);
                                cb(filtered);
                            }
                            else {
                                item.visits.order('date',false).limit(1).list(null, function(v) {
                                    angular.forEach(v, function(visit) {
                                        if(filter == 'return_visit' && visit.type == 'ra') {
                                            filtered.push(item);
                                        }
                                        if(visit.type == filter) {
                                            filtered.push(item);
                                        }
                                    });
                                    cb(filtered);
                                });
                            }
    
                        });
                    });
                }
            },
    
            getAppConfig: function(cb) {
                var config = AppConfig.all().limit(1);
                config.list(null,cb);
            },
    
            setAppConfig: function(given_config, cb) {
                var self = this;
                self.getAppConfig(function(config) {
                    var appConfig = {};
                    if(!config[0].lang) {
                        appConfig = new AppConfig({
                            lang: given_config.lang
                        });
                        persistence.add(appConfig);
                    }
                    else {
                        config[0].lang = given_config.lang;
                    }
                    persistence.flush();
                    cb(config);
                });
            },
    
            reset: function() {
                persistence.reset();
            },
    
            exportDb: function(cb) {
                var self = this;
                var backup = [];
                var territories = Territory.all();
                var visits = Visit.all();
                var counter = 1;
                visits.count(null, function(vCnt) {
                    console.log('vCnt',vCnt);
                    territories.each(null, function(t) {
                        t.streets.each(null, function(s) {
                            s.addresses.each(null, function(a) {
                                a.visits.each(null, function(v) {
                                    console.log('counter',counter);
                                    backup.push({
                                        territory_ident: t.ident,
                                        territory_city: t.city,
                                        street_name: s.name,
                                        address_housenumber: a.housenumber,
                                        address_info: a.info,
                                        address_name: a.name,
                                        address_gender: a.gender,
                                        address_age: a.age,
                                        address_type: a.type,
                                        visit_date: v.date,
                                        visit_note: v.note,
                                        visit_type: v.type
                                    });
                                    if(counter == vCnt) {
                                        cb(angular.toJson(backup,false));
                                    }
                                    counter++;
                                });
                            });
                        });
                    });
                });
    
            }
        };
    });
});
