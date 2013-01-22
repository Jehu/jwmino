Ext.define('JWMiNo.view.StreetsList', {
    extend: 'Ext.List'
    ,xtype: 'streetslist'
    ,config: {
        title: 'Liste der Straßen'
        ,xtype: 'list'
        ,store: 'streetsStore'
        ,itemTpl: '{name}'
        ,onItemDisclosure: true
        ,scrollable: { direction: 'vertical' }
    }
});
