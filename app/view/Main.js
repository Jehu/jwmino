Ext.define('JWMiNo.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',

    requires: [
        'JWMiNo.view.Territories'
        ,'JWMiNo.view.Streets'
    ],

    config: {
        tabBarPosition: 'bottom'
        ,fullscreen: true
        ,items: [{
             xtype: 'territories'
        }]
    }
});
