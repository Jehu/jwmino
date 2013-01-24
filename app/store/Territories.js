Ext.define('JWMiNo.store.Territories',{
    extend: 'Ext.data.Store'
    ,requires:['Ext.data.proxy.LocalStorage']
    ,config: {
        autoLoad: true
        ,model: 'JWMiNo.model.Territory'
        ,storeId: 'territoriesStore'
        ,sorters: 'ident'
        ,grouper: function(record) {
            return record.get('city').substr(0,1);
        }
    }
});
