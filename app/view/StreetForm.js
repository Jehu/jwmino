Ext.define('JWMiNo.view.StreetForm', {
    extend: 'Ext.form.Panel'
    ,xtype: 'streetform'
    ,requires: [
        'Ext.form.FieldSet'
        ,'Ext.field.Hidden'
    ]

    ,config: {
        title: 'Neu'
        ,iconCls: 'add'
        ,iconMask: true
        ,items: [{
            xtype: 'fieldset'
            ,title: 'Straße hinzufügen'
            ,items: [
                {
                    xtype: 'textfield'
                    ,name: 'name'
                    ,label: 'Straßenname'
                    ,required: true
                },{
                    xtype: 'hiddenfield'
                    ,name: 'territory_id'
                }
            ]
        },{
            xtype: 'button'
            ,text: 'Speichern'
            ,action: 'saveStreetBtnAction'
        }]
    },

});
