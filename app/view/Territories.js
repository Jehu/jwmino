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
        //,xtype: 'container'
        ,autoDestroy: false
        ,iconCls: 'locate'
        ,iconMask: true
        ,scrollable: true
        ,navigationBar: {
            //ui: 'dark'
            docked: 'top'
            ,defaults: {
                //hideAnimation: Ext.os.is.Android ? false : {
                //    type: 'fadeOut'
                //    ,duration: 200
                //}
                //,showAnimation: Ext.os.is.Android ? false : {
                //    type: 'fadeIn'
                //    ,duration: 200
                //}
            }
            ,items: [{
                xtype: 'button'
                ,align: 'right'
                ,iconCls: 'add'
                ,iconMask: true
                ,action: 'addTerritoryBtnAction'
                ,itemId: 'btnAddTerritory'
                ,hidden: false
            },{
                xtype: 'button'
                ,align: 'right'
                ,iconCls: 'add'
                ,iconMask: true
                ,action: 'addStreetBtnAction'
                ,itemId: 'btnAddStreet'
                ,hidden: false
            }]
        }
        ,items: [{
            xtype: 'territorieslist'
        }]
        ,listeners: {
            push: function(view, item) {
                var btnId;
                switch(item.xtype) {
                    case 'territorieslist':
                        btnId = 'btnAddTerritory';
                        break;
                    case 'streetslist':
                        btnId = 'btnAddStreet';
                        break;
                }
                if(item.xtype === "territoryform") {
                    view.hidePlusButtons();
                    return;
                }
                view.showPlusButton(btnId);
            }
            ,back: function(view, item) {
                var active = this.getActiveItem().xtype;
                if(active == 'territorieslist') {
                    view.showPlusButton('btnAddTerritory');
                }
                if(active == 'streetslist') {
                    view.showPlusButton('btnAddStreet');
                }
            }
            ,activate: function(view, item) {
                view.showPlusButton('btnAddTerritory');
            }
        }
    }
    ,showPlusButton: function(btnId){
        this.hidePlusButtons();
        var navbar = this.getNavigationBar();
        var btn = navbar.down('#' + btnId);
        if(btn) {
            btn.show();
        }

    }
    ,hidePlusButtons: function() {
        var navbar = this.getNavigationBar();
        var btn = navbar.query('button[align=right]');
        if(btn.length) {
            Ext.each(btn, function(item) {
                item.hide();
            });
        }
    }
});
