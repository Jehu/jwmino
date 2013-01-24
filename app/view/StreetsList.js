Ext.define('JWMiNo.view.StreetsList', {
    extend: 'Ext.List'
    ,xtype: 'streetslist'
    ,currentRecord: {}
    ,relatedRecord: {}
    ,config: {
        title: 'Liste der Straßen'
        ,xtype: 'list'
        ,store: 'streetsStore'
        ,itemTpl: '{name}'
        ,onItemDisclosure: true
        ,scrollable: { direction: 'vertical' }
        ,emptyText: 'Es wurden noch keine Straßen eingegeben.'
        ,selectedCls: ''
    }
});
