Ext.ns('Ext.ux.touch');
/**
 * @author Beni Gartenmann
 *
 * @class Ext.ux.touch.DateTimePickerField
 * @extends Ext.form.Field
 *
 * Specialized field which is connected to a DateTimePicker.
 *
 * @xtype datetimepickerfield
 */
Ext.ux.touch.DateTimePickerField = Ext.extend(Ext.form.Field, {
    ui: 'datetimepicker',
    picker: null,

    renderTpl: [
    '<tpl if="label">',
    '<div class="x-form-label"><span>{label}</span></div>',
    '</tpl>',
    '<tpl if="fieldEl">',
    '<div class="x-form-field-container"><div id="{inputId}" name="{name}" class="{fieldCls}"',
    '<tpl if="style">style="{style}" </tpl> ></div>',
    '<tpl if="useMask"><div class="x-field-mask"></div></tpl>',
    '</div>',
    '</tpl>'
    ],


    // @private
    initComponent: function() {
        this.tabIndex = -1;
        this.useMask = true;

        Ext.ux.touch.DateTimePickerField.superclass.initComponent.apply(this, arguments);
    },


    /**
     * @private
     * Listener to the tap event of the mask element. Shows the internal timePicker component when the button has been tapped.
     */
    onMaskTap: function() {
        if (Ext.ux.touch.DateTimePickerField.superclass.onMaskTap.apply(this, arguments) !== true) {
            return false;
        }

        this.getEl().radioCls('selected');
        this.picker.setValue(this.value);
        this.picker.ref_field = this;
    },


    // inherit docs
    setValue: function(value, animated) {
        if (!Ext.isDate(value)) {
            value = null;
        }

        this.value = value;

        if (this.rendered) {
            this.fieldEl.dom.innerHTML = this.getValue();
        }

        return this;
    },


    /**
     * Returns the value of the field as a string
     */
    getValue: function() {
        var value = this.value || null;

        if(this.format){
            value = value.format(this.format) + "<span class='time'>"+ value.format('H:i') +"</span>";
        }
        return value;
    }
});

Ext.reg('datetimepickerfield', Ext.ux.touch.DateTimePickerField);