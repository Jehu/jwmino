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
            ,btnAddStreet: "button[action=addStreetBtnAction]"
            ,territoriesView: "territories"
            ,streetsView: "streets"
            ,streetsListView: "streetslist"
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
            ,'territorieslist': {
                disclose: function(element, record) {
                    this.getTerritoriesView().push({
                        xtype: 'streetslist'
                    });
                    this.currentRecord = record;
                }
            }
            ,'streetslist': {
                disclose: function(element, record) {
                    this.currentRecord = record;
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
        this.getTerritoriesView().push({
            xtype: 'territoryform'
        });
    }

    ,onClickAddStreet: function(a,b,c) {
        this.getTerritoriesView().push({
            xtype: 'streetform'
        });
    }

    ,onClickSaveTerritory: function(button) {
        var form = this.getTerritoryForm();
        var store = Ext.getStore('territoriesStore');
        store.add(form.getValues());
        store.sync();
    }

    ,onClickSaveStreet: function(button) {
        var form = this.getStreetForm();
        form.setValues({territory_id: this.currentRecord.data.id});
        if(!this.currentRecord.data.id) {
            // FIXME error handling
            console.log('currentRecord.data.id not set!');
        }

        // We have to use model if we want to validate against it
        var model = Ext.create('JWMiNo.model.Street', form.getValues());
        var errors = model.validate();
        var message = '';

        if(errors.isValid()) {
            // save data thru store, not model.
            var store = Ext.getStore('streetsStore');
            var streetsList = this.getStreetsListView();

            store.add(form.getValues());
            store.sync();
            //form.reset();
            view = this.getTerritoriesView();
            view.pop('streetform');
            view.showPlusButton('btnAddStreet');

        }
        else {
            Ext.each(errors.items, function(record) {
                message += record.config.field + ' ' + record.config.message + "<br />";
            });
            Ext.Msg.alert("Validate", message, function() {});
            return false;
        }
    }
    ,launch: function() {
        //streetsStore = Ext.getStore('streetsStore');
        //streetsStore.removeAll();
        //streetsStore.sync();
    }
});
