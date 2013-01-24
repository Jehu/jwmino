Ext.define('JWMiNo.view.TerritoriesList', {
    extend: 'Ext.List'
    ,xtype: 'territorieslist'
    ,currentRecord: {}
    ,relatedRecord: {}
    ,config: {
        title: 'Liste der Gebiete'
        ,store: 'territoriesStore'
        ,itemTpl: '{ident} {city}'
        ,onItemDisclosure: true
        ,scrollable: { direction: 'vertical' }
        ,grouped: true
        ,emptyText: 'Es wurden noch keine Gebiete eingegeben.'
        ,selectedCls: ''
        ,listeners: {
            itemtaphold: {
                buffer: 300
                ,fn: function(element, index, target, record) {

                    // set record in prototype to have it in all instances
                    JWMiNo.view.TerritoriesList.addMembers({
                        currentRecord: record
                    });

                    Ext.Viewport.add({
                        xtype: 'panel'
                        ,centered: true
                        ,modal: true
                        ,hideOnMaskTap: true
                        ,hidden: false
                        ,styleHtmlContent: true
                        ,scrollable: false
                        ,itemId: 'modalContextTerritory'
                        ,defaults: {
                            xtype: 'button'
                            ,width: 300
                            ,margin: '3px 0 3px 0'
                            ,ui: 'default'
                        }
                        ,layout: 'vbox'
                        ,items: [{
                            text: 'Ändern'
                            ,ui: 'action'
                            ,action: 'editTerritoryBtnAction'
                        },{
                            text: 'Löschen'
                            ,ui: 'decline'
                            ,action: 'deleteTerritoryBtnAction'
                        }]
                    });
                }
            }
        }
    }
});
