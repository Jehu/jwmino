Ext.define('JWMiNo.view.TerritoriesList', {
    extend: 'Ext.List'
    ,xtype: 'territorieslist'
    ,config: {
        title: 'Liste der Gebiete'
        ,store: 'territoriesStore'
        ,itemTpl: '{ident} {city}'
        ,onItemDisclosure: true
        ,scrollable: { direction: 'vertical' }
    }
});
