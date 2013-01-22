Ext.define('JWMiNo.view.Streets', {
    extend: 'Ext.navigation.View'
    ,xtype: 'streets'
    ,requires: [
        'JWMiNo.view.StreetForm'
        ,'Ext.navigation.View'
        ,'Ext.TitleBar'
    ]

    ,config: {
        title: 'Streets'
        ,iconCls: 'list'
        ,iconMask: true
        ,scrollable: true
        ,items: [{
            xtype: 'streetslist'
        }]
    }
});
