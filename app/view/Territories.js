Ext.define('JWMiNo.view.Territories', {
    extend: 'Ext.navigation.View'
    ,xtype: 'territories'
    ,requires: [
        'JWMiNo.view.TerritoryForm'
        ,'JWMiNo.view.TerritoriesList'
        ,'Ext.navigation.View'
        ,'Ext.TitleBar'
    ]

    ,config: {
        title: 'Gebiete'
        ,xtype: 'container'
        ,iconCls: 'locate'
        ,iconMask: true
        ,scrollable: true
        ,items: [{
            xtype: 'territorieslist'
        }]
        ,listeners: {
            push: function(view, item) {
                var action;
                switch(item.xtype) {
                    case 'territorieslist':
                        action = 'addTerritoryBtnAction';
                        break;
                    case 'streetslist':
                        action = 'addStreetBtnAction';
                        break;
                }
                if(item.xtype === "territoryform") {
                    view.removePlusButton();
                    return;
                }
                view.removePlusButton();
                view.addPlusButton(action);
            }
            ,back: function(view, item) {
                var active = this.getActiveItem().xtype;
                if(active === 'territorieslist') {
                    view.removePlusButton();
                    view.addPlusButton('addTerritoryBtnAction');
                }
            }
            ,show: function(view, item) {
                console.log('show');
            }
            ,activate: function(view, item) {
                view.removePlusButton();
                view.addPlusButton('addTerritoryBtnAction');
            }
        }
    }
    ,addPlusButton: function(action){
        // FIXME refactor to seperate buttons and just show / hide them on demand
        var titlebar = this.down('titlebar');

        // Add "+" Button to parent titlebar
        titlebar.add(Ext.create('Ext.Button', {
            align: 'right'
            ,iconCls: 'add'
            ,iconMask: true
            ,action: action
            ,itemId: 'addBtn'
        }));
    }
    ,removePlusButton: function() {
        var titlebar = this.down('titlebar');

        // remove existing "+" button from parent titlebar, if any exists
        var existingAddBtn = titlebar.query('#addBtn');
        if(existingAddBtn.length) {
            existingAddBtn[0].destroy();
        }
    }
});
