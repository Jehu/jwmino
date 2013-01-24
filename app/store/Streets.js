Ext.define('JWMiNo.store.Streets',{
    extend: 'Ext.data.Store'
    ,requires:['Ext.data.proxy.LocalStorage']
    ,config: {
        autoLoad: true
        ,model: 'JWMiNo.model.Street'
        ,storeId: 'streetsStore'
        ,sorters: 'name'
    }
    ,filterByTerritory: function(territory) {
        this.clearFilter();
        this.filterBy(function(street) {
            if(street.data.territory_id === territory.data.id) {
                return true;
            }
        });
    }
});
