Ext.ns('Ext.ux.touch');
/**
 * @author Beni Gartenmann
 *
 * @class Ext.ux.touch.DateTimePicker
 * @extends Ext.Picker
 *
 * Specialized Picker for picking DateTime values.
 *
 * @xtype datetimepicker
 */
Ext.ux.touch.DateTimePicker = Ext.extend(Ext.Picker, {

    /**
     * some settings to make the picker appear in the floating panel
     */
    stretchX: false,
    stretchY: false,
    modal: false,
    floating: false,
    dock: 'bottom',
    hidden: false,

    cls: 'datetimepicker',

    /**
     * @cfg {Number} yearFrom
     * The start year for the date picker.  Defaults to current year - 10
     */
    yearFrom: new Date().add(Date.YEAR, -10).getFullYear(),

    /**
     * @cfg {Number} yearTo
     * The last year for the date picker.  Defaults to the current year + 10
     */
    yearTo: new Date().add(Date.YEAR, 10).getFullYear(),

    /**
     * @cfg {Array} slotOrder
     * An array of strings that specifies the order of the slots. Defaults to <tt>['day', 'month', 'year', 'hour', 'minute']</tt>.
     */
    slotOrder: ['day', 'month', 'year', 'hour', 'minute'],

    initComponent: function() {

        var yearsFrom = this.yearFrom,
        yearsTo = this.yearTo,
        years = [],
        days = [],
        months = [],
        hours = [],
        minutes = [],
        ln, tmp, i, daysInMonth;

        // swap values if user mixes them up.
        if (yearsFrom > yearsTo) {
            tmp = yearsFrom;
            yearsFrom = yearsTo;
            yearsTo = tmp;
        }

        for (i = yearsFrom; i <= yearsTo; i++) {
            years.push({
                text: i,
                value: i
            });
        }


        if (this.value) {
            if(!Ext.isDate(this.value)){
                this.value = null;
            }
        }
        if(this.value){
            daysInMonth = this.getDaysInMonth(this.value.getMonth(), this.value.getFullYear);
        } else {
            daysInMonth = this.getDaysInMonth(1, new Date().getFullYear());
        }
        for (i = 0; i < daysInMonth; i++) {
            var d = new Date(yearsFrom, 0, i+1);
            days.push({
                text: d.format('D, j.'),
                value: i + 1
            });
        }

        for (i = 0, ln = Date.monthNames.length; i < ln; i++) {
            months.push({
                text: Ext.is.Phone ? Date.monthNames[i].substring(0, 3) : Date.monthNames[i],
                value: i
            });
        }

        for (i = 0; i < 60; i += 5) {
            minutes.push({
                text: i,
                value: i
            });
        }

        for (i = 1; i <= 24; i++) {
            hours.push({
                text: i,
                value: i
            });
        }
        

        this.slots = [];
        Ext.each(this.slotOrder, function(item) {
            this.slots.push(this.createSlot(item, days, months, years, hours, minutes));
        }, this);

        Ext.ux.touch.DateTimePicker.superclass.initComponent.call(this);
    },

    createSlot: function(name, days, months, years, hours, minutes) {
        switch (name) {
            case 'year':
                return {
                    name: 'year',
                    align: 'center',
                    data: years,
                    flex: 1.5
                };
            case 'month':
                return {
                    name: name,
                    align: 'center',
                    data: months,
                    flex: Ext.is.Phone ? 1.5 : 2.5
                };
            case 'day':
                return {
                    name: 'day',
                    align: 'center',
                    data: days,
                    flex: Ext.is.Phone ? 3 : 2.2
                };
            case 'hour':
                return {
                    name: 'hour',
                    align: 'right',
                    data: hours,
                    flex: 1.1
                };
            case 'minute':
                return {
                    name: 'minute',
                    align: 'left',
                    data: minutes,
                    flex: 1.1
                };
        }
    },

    // @private
    onSlotPick: function(slot, value) {
        var name = slot.name,
        date;

        if (name === "month" || name === "year") {
            date = this.getValue();
            this.updateDaySlot(date);
        }

        Ext.DatePicker.superclass.onSlotPick.call(this, slot, value);
    },

    /**
     * Gets the current value as a Date object
     * @return {Date} value
     */
    getValue: function() {
        var value = Ext.DatePicker.superclass.getValue.call(this),
        daysInMonth = this.getDaysInMonth(value.month, value.year),
        day = Math.min(value.day, daysInMonth);
        return new Date(value.year, value.month, day, value.hour, value.minute);
    },

    // @private
    getDaysInMonth: function(month, year) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        // if month is Feburary (i.e. month 1, due to getDate() counts from 0
        // and isLeapYear() return 29 days else return daysInMonth[month as arrayIndex]
        return month == 1 && this.isLeapYear(year) ? 29 : daysInMonth[month];th[month];
    },

    // @private
    isLeapYear: function(year) {
        return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
    },

    updateDaySlot: function(date){
        var daySlot = this.child('[name=day]');
        var daysInMonth = this.getDaysInMonth(date.getMonth(), date.getFullYear());
        var days = [];
        for (var i = 0; i < daysInMonth; i++) {
            var d = new Date(date.getFullYear(), date.getMonth(), i+1);
            days.push({
                text: d.format('D, j.'),
                value: i + 1
            });
        }
        daySlot.store.loadData(days);
        if(daySlot.scroller) daySlot.scroller.updateBoundary(true);
    },

    setValue: function(values, animated) {
        //values should be a date object...
        this.updateDaySlot(values);
        
        var key, slot, items = this.items.items,
        ln = items.length;

        if(Ext.isDate(values)){
            values = {
                day: values.getDate(),
                month: values.getMonth(),
                year: values.getFullYear(),
                hour: values.getHours(),
                minute: values.getMinutes()
            }
        }

        // Value is an object with keys mapping to slot names
        if (!values) {
            for (var i = 0; i < ln; i++) {
                items[i].setValue(0);
            }
            return this;
        }
        
        for (key in values) {
            slot = this.child('[name=' + key + ']');
            if (slot) {
                slot.setValue(values[key], animated);
            }
        }
        return this;
    }
});

Ext.reg('datetimepicker', Ext.ux.touch.DateTimePicker);
