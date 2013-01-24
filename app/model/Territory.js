Ext.define('JWMiNo.model.Territory',{
    extend: 'Ext.data.Model'
    ,config: {
        fields: [
             { name: 'ident', type: 'string' , unique: true }
            ,{ name: 'city', type: 'string' }
            ,{ name: 'processed_at', type: 'date' }
        ]
        ,validations: [
             { type: 'presence', field: 'ident' }
            ,{ type: 'presence', field: 'city' }
        ]
        ,identifier: 'uuid'
        ,proxy: {
            type: 'localstorage'
            ,id: 'jwmino-territories'
        }
        ,hasMany: { model: 'JWMiNo.model.Street', name: 'streets' }
    }
});
