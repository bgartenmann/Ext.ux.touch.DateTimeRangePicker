Ext.ns('Ext.ux.touch');
/**
 * @author Beni Gartenmann
 *
 * @class Ext.ux.touch.DateTimeRangeField
 * @extends Ext.form.Field
 *
 * Specialized field with a mask which when tapped, shows a Ext.ux.touch.DateTimePickerPanel, for picking datetime values (from, to).
 *
 * @xtype datetimerangefield
 */
Ext.ux.touch.DateTimeRangeField = Ext.extend(Ext.form.Field, {
    ui: 'datetimerange',
    picker: null,
    destroyPickerOnHide: false,

    useMask: true,

    cls: Ext.is.Phone ? 'phone' : '',

    labelWidth: '20%',

    label: {
        from: 'from',
        to: 'to'
    },

    value: {
        from: new Date(),
        to: new Date().add(Date.HOUR, 1)
    },

    format: Ext.is.Phone ? "D, M d, 'y" : "D, M d, Y",


    renderTpl: [
    '<tpl if="label">',
    '<div class="x-form-label"><span>{label.from}<br />{label.to}</span></div>',
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
        this.cls = this.useMask ? this.cls : this.cls + "display-only";
        this.tabIndex = -1;
        Ext.ux.touch.DateTimeRangeField.superclass.initComponent.apply(this, arguments);
    },

    getDateTimePickerPanel: function(){
        var config = {
            picker: this.picker,
            value: this.value,
            label: this.label,
            format: this.format,
            ref_field: this,
            pickerpanel: this.pickerpanel
        };

        if(Ext.is.Phone){
            Ext.apply(config, {
                fullscreen: true
            });
        }

        var dtpp = new Ext.ux.touch.DateTimePickerPanel(config);
        
        return dtpp;
    },

    /**
     * @private
     * Listener to the tap event of the mask element. Shows the internal timePicker component when the button has been tapped.
     */
    onMaskTap: function() {
        if (Ext.ux.touch.DateTimeRangeField.superclass.onMaskTap.apply(this, arguments) !== true) {
            return false;
        }

        if(Ext.is.Phone){
            this.getDateTimePickerPanel().show();
        } else {
            this.getDateTimePickerPanel().showBy(this, '', false);
        }
    },

    roundToNext5Minutes: function(date){
        date.setSeconds(0);
        var m = date.getMinutes();
        m = (m % 5) > 0 ? parseInt(m / 5) * 5 + 5 : m;
        date.setMinutes(m);
    },


    // inherit docs
    setValue: function(value, animated) {
        if (!Ext.isObject(value)) {
            value = null;
        }

        if(value){
            this.roundToNext5Minutes(value.from);
            this.roundToNext5Minutes(value.to);
        }
        this.value = value;

        if (this.rendered) {
            this.fieldEl.dom.innerHTML = this.getDisplayValue();
        }
        return this;
    },

    /**
     * Returns the value of the field as a string
     */
    getDisplayValue: function(){
        var value = this.value || null;
        if(Ext.isObject(value)){
            if(this.format){
            	var date_from = value.from.format(this.format);
                var date_to = date_from != value.to.format(this.format) ? value.to.format(this.format) : '';
                value = date_from + "<span class='time'>"+ value.from.format('H:i') +"</span><br />" + date_to + "<span class='time'>"+ value.to.format('H:i') +"</span>";
            } else {
                value = value.from + "<br />" + value.to
            }
        }
        return value;
    },

    /**
     * Returns the value of the field as an object
     */
    getValue: function() {
        var value = this.value || null;
        if(!Ext.isObject(value)){
            value = null;
        }
        return value;
    }
});

Ext.reg('datetimerangefield', Ext.ux.touch.DateTimeRangeField);