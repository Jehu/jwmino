Ext.define('JWMiNo.model.Street',{
    extend: 'Ext.data.Model'
    ,config: {
        fields: [
             { name: 'name', type: 'string' }
             ,{ name: 'territory_id', type: 'string' }
        ]
        ,validations: [
             { type: 'presence', field: 'name' }
             ,{ type: 'presence', field: 'territory_id' }
        ]
        ,identifier: 'uuid'
        ,proxy: {
            type: 'localstorage'
            ,id: 'jwmino-streets'
        }
        ,belongsTo: 'JWMiNo.model.Territory'
    }
});
