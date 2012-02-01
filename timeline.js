;(function($) {
    var MARK = 'mark';
    var LABEL = 'label';
    var CURSOR  = 'cursor';
    var TIMELINE = 'timeline-scale-';

    function Timeline(element, options) {
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

             
    Timeline.prototype = {
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

            for(var i = 0, l = this.elements.length; i < l; i++) {
                var element = this.elements[i];
                if(element != undefined) {
                    this.positionElement(element);
                }
            }

            // TODO: Only remove custom class attributes
            this.base.attr('class', '');
            this.draw();
        },

        draw: function() {
            this.base.addClass(TIMELINE + this.options.scale);
            this.base.width((this.options.end - this.options.start) * 60 * this.options.scale);

            // Go for it
            for(var i = 0; i < this.options.end - this.options.start; i++) {
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
                    self.positionElement(self.cursor);
                    self.lastUpdate = currentDate;
                    self.onTick();
                }
                
            }, 1000);
        },

        addElement: function(element, date, top) {
            element.data('date', date).data('top', top);
            this.positionElement(element);
            this.elements.push(element);
            this.base.append(element);
        },

        positionElement: function(element) {
            element.css({
                'left': this._dateAsMinutes(element.data('date')),
                'top': element.data('top')
            });
        },

        removeElement: function(element) {
            var index = this.elements.indexOf(element);
            if(~index) {
                // This leaves a hole in the array, it's on purpose
                delete this.elements[index];
            }
            element.remove();
        },

        clearElements: function(CLS) {
            this.base.find('.' + CLS).remove();  
        },

        drawMark: function(num) {
            var mark = this._createElement(MARK, '');
            mark.height(this.base.height());
            mark.css('left', num * 60 * this.options.scale);
            this.base.append(mark);
        },

        clearMarks: function() {
            this.clearElements(MARK);
        },

        drawLabel: function(num) {
            var label = this._createElement(LABEL, num + this.options.start);
            this.base.append(label); // Appending prior to setting the position in order to have a width
            label.css('left', (num * 60 * this.options.scale) - label.width() / 2 );
        },

        clearLabels: function() {
            this.clearElements(LABEL);
        },

        drawCursor: function() {
            this.cursor = $('<div class="cursor"></div>');
            this.cursor.height(this.base.height());
            this.addElement(this.cursor, this.date, null);
        },

        _dateAsMinutes: function(date) {
            var hours = (date.getHours() - this.options.start) * 60 * this.options.scale;
            var minutes = date.getMinutes() * this.options.scale;
            return hours + minutes;
        },
  
        _createElement: function(className, html) {
            return $('<div class="' + className + '">' + html + '</div>');
        },

    };

    $.fn.timeline = function(options) {
        return new Timeline(this, options);
    };
        
})(jQuery);