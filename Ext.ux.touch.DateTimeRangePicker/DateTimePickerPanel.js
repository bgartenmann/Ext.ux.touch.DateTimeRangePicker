Ext.ns('Ext.ux.touch');
/**
 * @author Beni Gartenmann
 *
 * @class Ext.ux.touch.DateTimePickerPanel
 * @extends Ext.Panel
 *
 * Specialized floating Panel with two DateTimePickerFields and a DateTimePicker inside.
 *
 * @xtype datetimepickerpanel
 */
Ext.ux.touch.DateTimePickerPanel = Ext.extend(Ext.Panel, {

    cls: Ext.is.Phone ? 'datetimepicker-panel phone' : 'datetimepicker-panel',
    hideOnMaskTap:false,

    cancel: 'cancel',
    done: 'done',
    errorTitle: "Can't save the date",
    errorMsg: 'Start date has to be before end date.',


    floating: true,
    modal: false,
    centered: false,
    width: Ext.is.Phone ? 320 : 400,
    height: Ext.is.Phone ? 400 : 430,

    padding: Ext.is.Phone ? 0 : 6,

    // @private
    initComponent: function() {

        if(this.pickerpanel){
            this.cancel = this.pickerpanel.cancel || this.cancel;
            this.done = this.pickerpanel.done || this.done;
            this.errorTitle = this.pickerpanel.errorTitle || this.errorTitle;
            this.errorMsg = this.pickerpanel.errorMsg || this.errorMsg;
        }

        if (this.picker instanceof Ext.ux.touch.DateTimePicker) {
            this.dateTimePicker = this.picker;
        } else {
            if (this.picker && this.value) {
                this.picker.value = this.value.from;
            } else if(this.value) {
                this.picker = {
                    value: this.value.from
                }
            } else {
                this.picker = {
                    value: new Date()
                };
            }
            this.dateTimePicker = new Ext.ux.touch.DateTimePicker(this.picker);
        }

        this.dateTimePicker.on({
            scope : this,
            pick: this.onPickerChange
        });

        this.from_field = new Ext.ux.touch.DateTimePickerField({
            picker: this.dateTimePicker,
            value: this.value.from,
            label: this.label.from,
            labelWidth: '20%',
            format: this.format,
            cls: 'selected'
        });
        this.to_field = new Ext.ux.touch.DateTimePickerField({
            picker: this.dateTimePicker,
            value: this.value.to,
            label: this.label.to,
            labelWidth: '20%',
            format: this.format
        });

        this.form = new Ext.form.FormPanel({
            items: [{
                xtype: 'fieldset',
                items: [this.from_field, this.to_field]
            }]
        });


        this.dateTimePicker.ref_field = this.from_field;

        var toolbar = new Ext.Toolbar({
            dock : 'top',
            title: this.label.from +", "+ this.label.to,
            items: [
            {
                text: this.cancel,
                handler: this.onCancelButtonTap,
                scope: this
            },{
                xtype: 'spacer'
            },{
                text: this.done,
                ui: 'action',
                handler: this.onDoneButtonTap,
                scope: this
            }
            ]

        });
        
        Ext.apply(this, {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            dockedItems: [toolbar, this.dateTimePicker],
            items: [this.form],
            scroll: false,
            listeners:{
                afterrender:function(){
                    this.dateTimePicker.getDockedComponent(0).hide();
                }
            }
        });

        Ext.ux.touch.DateTimePickerPanel.superclass.initComponent.call(this);
    },

    getValue: function(){
        var value = {
            from: this.from_field.value,
            to: this.to_field.value
        }
        return value;
    },
        
    /**
     * @private
     * Called when the done button has been tapped.
     */
    onDoneButtonTap : function() {
        if(this.dateTimePicker.ref_field.value > this.to_field.value || this.dateTimePicker.ref_field.value < this.from_field.value){
            Ext.Msg.alert(this.errorTitle, this.errorMsg, Ext.emptyFn);
            return false;
        }

        this.ref_field.setValue(this.getValue());
        this.hide();
    },

    /**
     * @private
     * Called when the cancel button has been tapped.
     */
    onCancelButtonTap : function() {
        this.fireEvent('cancel', this);
        this.hide();
    },

    /**
     * Called when the picker changes its value
     * @param {Ext.TimePicker} picker The time picker
     * @param {Object} value The new value from the time picker
     * @private
     */
    onPickerChange : function(picker, value) {
        this.dateTimePicker.ref_field.setValue(value);
        this.to_field.refreshValue();
        
        if(this.dateTimePicker.ref_field.value > this.to_field.value || this.dateTimePicker.ref_field.value < this.from_field.value){
            this.to_field.getEl().addCls('error');
            this.from_field.getEl().addCls('error');
        } else {
            this.to_field.getEl().removeCls('error');
            this.from_field.getEl().removeCls('error');
        }
    }
});

Ext.reg('datetimepickerpanel', Ext.ux.touch.DateTimePickerPanel);