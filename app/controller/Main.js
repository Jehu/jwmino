Ext.define('JWMiNo.controller.Main', {
    extend: 'Ext.app.Controller'
    ,requires: [
        'JWMiNo.store.Territories'
    ]
    ,record: {}

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
            ,'territories list': {
                disclose: function(element, record) {
                    this.getTerritoriesView().push({
                        xtype: 'streetslist'
                    });
                    this.record = record;
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
        console.log("btn Add Street clicked");
        var form = this.getTerritoriesView();
        form.push({
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
        form.setValues({territory_id: this.record.data.id});

        var model = Ext.create('JWMiNo.model.Street', form.getValues());
        var errors = model.validate();
        var message = '';

        if(errors.isValid()) {
            var store = Ext.getStore('streetsStore');
            var streetsList = this.getStreetsListView();

            store.add(form.getValues());
            store.sync();
            form.reset();
            this.record = {};
        }
        else {
            Ext.each(errors.items, function(record) {
                message += record.config.field + ' ' + record.config.message + "<br />";
            });
            Ext.Msg.alert("Validate", message, function() {});
            return false;
        }
    }

    //called when the Application is launched, remove if not needed
    ,launch: function(app) {
    }
});
