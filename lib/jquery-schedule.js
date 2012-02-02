;(function($) {
    var MARK = 'mark';
    var LABEL = 'label';
    var CURSOR  = 'cursor';
    var SCHEDULE = 'schedule-scale-';

    function Schedule(element, options) {
        this.base = $(element);
        this.setOptions(options);
        this.elements = [];

        this.date = this.options.date || (new Date);

        this.onTick = this.options.onTick || $.noop;
        this.onDraw = this.options.onDraw || $.noop;

        this.interval = null;
        this.lastUpdate = new Date();

        this.draw();
        this.drawCursor();
    }

             
    Schedule.prototype = {
        options: {
            start: 0,
            end: 24,
            scale: 2
        },

        setOptions: function(options) {
            var option;
            options = options || {};
            for(option in options) {
                this.options[option] = options[option];
            }
        },

        refresh: function(options) {
            this.clearMarks();
            this.clearLabels();

            this.setOptions(options);

            var element;
            // jQuery's each sucks
            for(var i = 0, l = this.elements.length; i < l; i++) {
                element = this.elements[i];
                if(element != undefined) {
                    this._positionElement(element);
                }
            }

            // TODO: Only remove custom class attributes
            this.base.attr('class', '');
            this.draw();
        },

        draw: function() {
            this.base.addClass(SCHEDULE + this.options.scale);
            this.base.width((this.options.end - this.options.start) * 60 * this.options.scale);

            var i = 0;
            for(; i < this.options.end - this.options.start; i++) {
                this.drawMark(i);
                this.drawLabel(i);
            }

            this.onDraw(this.options);
        },

        tick: function() {
            var self = this;
            clearInterval(this.interval);

            this.interval = setInterval(function() {
                var currentDate = new Date();
                if(self.lastUpdate.getMinutes() != currentDate.getMinutes()) {
                    self.lastUpdate = currentDate;
                    self.cursor.data('date', self.lastUpdate);
                    self._positionElement(self.cursor);
                    self.onTick(self.lastUpdate);
                }
                
            }, 500);
        },

        addElement: function(element, date, top) {
            element.data('date', date).data('top', top);
            this._positionElement(element);
            this.elements.push(element);
            this.base.append(element);
        },

        removeElement: function(element) {
            var index = this.elements.indexOf(element);
            if(~index) delete this.elements[index];
            element.remove();
        },

        drawMark: function(num) {
            var mark = this._createElement(MARK, '');
            mark.height(this.base.height());
            mark.css('left', num * 60 * this.options.scale);
            this.base.append(mark);
        },

        clearMarks: function() {
            this._clearElements(MARK);
        },

        drawLabel: function(num) {
            var label = this._createElement(LABEL, num + this.options.start);
            this.base.append(label);
            label.css('left', (num * 60 * this.options.scale) - label.width() / 2 );
        },

        clearLabels: function() {
            this._clearElements(LABEL);
        },

        drawCursor: function() {
            this.cursor = $('<div class="cursor"></div>');
            this.cursor.height(this.base.height());
            this.addElement(this.cursor, this.date, null);
        },

        _clearElements: function(cls) {
            this.base.find('.' + cls).remove();
        },

        _dateAsMinutes: function(date) {
            var hours = (date.getHours() - this.options.start) * 60 * this.options.scale;
            var minutes = date.getMinutes() * this.options.scale;
            return hours + minutes;
        },
  
        _createElement: function(className, html) {
            return $('<div class="' + className + '">' + html + '</div>');
        },

        _positionElement: function(element) {
            element.css({
                'left': this._dateAsMinutes(element.data('date')),
                'top': element.data('top')
            });
        }

    };

    $.fn.schedule = function(options) {
        return new Schedule(this, options);
    };
        
})(jQuery);