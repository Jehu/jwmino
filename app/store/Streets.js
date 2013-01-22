Ext.define('JWMiNo.store.Streets',{
    extend: 'Ext.data.Store'
    ,requires:['Ext.data.proxy.LocalStorage']
    ,config: {
        autoLoad: true
        ,model: 'JWMiNo.model.Street'
        ,storeId: 'streetsStore'
        //,sorters: 'ident'
        //,grouper: function(record) {
        //    return record.get('city')[0]
        //}
    }
});
