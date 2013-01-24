Ext.define('JWMiNo.controller.Main', {
    extend: 'Ext.app.Controller'
    ,requires: [
        'JWMiNo.store.Territories'
    ]
    ,currentRecord: {} // needed for temprarily caching of currentRecords

    ,config: {
        refs: {
            btnSaveTerritory: "button[action=saveTerritoryBtnAction]"
            ,btnSaveStreet: "button[action=saveStreetBtnAction]"
            ,btnAddTerritory: "button[action=addTerritoryBtnAction]"
            ,btnEditTerritory: "button[action=editTerritoryBtnAction]"
            ,btnDeleteTerritory: "button[action=deleteTerritoryBtnAction]"
            ,modalContextTerritory: "#modalContextTerritory"
            ,btnAddStreet: "button[action=addStreetBtnAction]"
            ,territoriesView: "territories"
            ,territoriesListView: "territorieslist"
            ,streetsListView: "streetslist"
            ,streetsItem: "streetslist item"
            ,territoryForm: "territoryform"
            ,streetForm: "streetform"
        },
        control: {
            btnAddTerritory: {
                tap: "onClickAddTerritory"
            }
            ,btnAddStreet: {
                tap: "onClickAddStreet"
            }
            ,btnSaveTerritory: {
                tap: "onClickSaveTerritory"
            }
            ,btnSaveStreet: {
                tap: "onClickSaveStreet"
            }
            ,btnEditTerritory: {
                tap: "onClickEditTerritory"
            }
            ,btnDeleteTerritory: {
                tap: "onClickDeleteTerritory"
            }
            ,'territorieslist': {
                disclose: function(element, record) {
                    this.getTerritoriesView().push({
                        xtype: 'streetslist'
                    });

                    var view = this.getStreetsListView();

                    // set related record in prototype to have it in all instances
                    JWMiNo.view.StreetsList.addMembers({
                        relatedRecord: record
                    });
                    var store = view.getStore();

                    //this.currentRecord = record;

                    // change Title
                    this.refreshTitle('Straßen in ' + record.data.ident + ' ' + record.data.city);

                    store.filterByTerritory(record);
                }
            }
            ,'streetslist': {
                disclose: function(element, record) {
                    this.currentRecord = record;
                    /* FIXME, needed for knowing what street we came form
                    JWMiNo.view.AddressesList.addMembers({
                        relatedRecord: record
                    });
                    */

                    // change Title
                    this.refreshTitle('Adressen in ' + record.data.name);

                    /*
                    this.getTerritoriesView().push({
                        xtype: 'addresseslist'
                    });
                    */
                }
            }
        }
    }

    ,onClickAddTerritory: function() {
        var form = this.getTerritoryForm();
        if(!form) {
            form = Ext.create('JWMiNo.view.TerritoryForm');
        }
        this.getTerritoriesView().push(form);
        this.refreshTitle('Gebiet hinzufügen');
        this.getTerritoryForm().reset();
    }

    ,onClickEditTerritory: function() {
        var currentRecord = this.getTerritoriesListView().currentRecord;
        var form = this.getTerritoryForm();

        if(!form) {
            // create new form
            form = Ext.create('JWMiNo.view.TerritoryForm');
        }

        this.getTerritoriesView().push(form);
        if(currentRecord && 'data' in currentRecord) {
            form.setRecord(currentRecord);
        }

        this.refreshTitle('Gebiet ändern');

        // remove modal window
        this.getModalContextTerritory().destroy();
    }

    ,onClickDeleteTerritory: function() {
        console.log(this.getBtnDeleteTerritory());
    }

    ,onClickAddStreet: function() {
        this.getTerritoriesView().push({
            xtype: 'streetform'
        });
        this.refreshTitle('Straße zu ' + this.currentRecord.data.ident + ' hinzufügen');
        this.getStreetForm().reset();
    }

    ,onClickSaveTerritory: function() {
        var form = this.getTerritoryForm();
        var values = form.getValues();
        var record = form.getRecord();
        var model = {};

        if(record && 'data' in record) {
            // update model instance
            model = form.getRecord();
            model.set('ident', values.ident);
            model.set('city', values.city);
        }
        else {
            // create new model instance
            model = Ext.create('JWMiNo.model.Territory', values);
        }

        var errors = model.validate();
        var message = '';

        if(errors.isValid()) {
            var record = form.getRecord();
            var store = Ext.getStore('territoriesStore');

            if(!record || !'data' in record) {
                console.log('kein record da!');
                store.add(form.getValues());
            }
            store.sync();
            form.reset();
            form.setRecord(null);

            view = this.getTerritoriesView();
            view.pop('territoryform');
            view.showPlusButton('btnAddTerritory');

        }
        else {
            Ext.each(errors.items, function(record) {
                message += record.config.field + ' ' + record.config.message + "<br />";
            });
            Ext.Msg.alert("Validate", message, function() {});
            return false;
        }
    }

    ,onClickSaveStreet: function() {
        // FIXME: refactor like in onClickSaveTerritory...
        var form = this.getStreetForm();

        // We have to use model if we want to validate against it
        var model = Ext.create('JWMiNo.model.Street', form.getValues());
        var errors = model.validate();
        var message = '';

        if(errors.isValid()) {
            // save data thru store, not model.
            var store = Ext.getStore('streetsStore');

            store.add(form.getValues());
            store.sync();

            view = this.getTerritoriesView();
            view.pop('streetform');
            view.showPlusButton('btnAddStreet');
            form.reset();
            form.setRecord(null);
        }
        else {
            Ext.each(errors.items, function(record) {
                message += record.config.field + ' ' + record.config.message + "<br />";
            });
            Ext.Msg.alert("Validate", message, function() {});
            return false;
        }
    }
    ,refreshTitle: function(title) {
        var navbar = this.getTerritoriesView().getNavigationBar();
        navbar.setTitle(title);
    }
    ,launch: function() {
        streetsStore = Ext.getStore('streetsStore');
        streetsStore.removeAll();
        streetsStore.sync();
        territoriesStore = Ext.getStore('territoriesStore');
        territoriesStore.removeAll();
        territoriesStore.sync();
    }
});
