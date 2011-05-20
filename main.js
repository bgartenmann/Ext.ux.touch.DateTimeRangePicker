Ext.setup({
    onReady: function() {
        var p = new Ext.form.FormPanel({
            fullscreen : true,
            items      : [
            {
                xtype : "fieldset",
                title : "DateTimePicker",
                items : [
                {
                    xtype: "datetimerangefield"
                }]
            },{
                xtype: 'fieldset',
                items: [
                {
                    xtype: "datetimerangefield",
                    label: {
                        from: 'Von',
                        to: 'Bis'
                    },
                    pickerpanel: {
                        cancel: 'abbrechen',
                        done: 'fertig',
                        errorTitle: 'Fehler beim Speichern',
                        errorMsg: 'Das Startdatum muss vor dem Enddatum liegen.'
                    }
                }
                ]
            }
            ]
        });
    }
});

