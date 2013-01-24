Ext.define('JWMiNo.view.TerritoryForm', {
    extend: 'Ext.form.Panel'
    ,xtype: 'territoryform'
    ,currentRecord: {}
    ,requires: ['Ext.form.FieldSet']

    ,config: {
        title: 'Neu'
        ,iconCls: 'add'
        ,iconMask: true
        ,items: [{
            xtype: 'fieldset'
            ,title: 'Edit Territory'
            ,items: [{
                xtype: 'textfield'
                ,name: 'ident'
                ,label: 'Identifier'
                ,required: true
            },{
                xtype: 'textfield'
                ,name: 'city'
                ,label: 'City'
                ,required: true
            }]
        },{
            xtype: 'button'
            ,text: 'Speichern'
            ,action: 'saveTerritoryBtnAction'
        }]
    }
});
