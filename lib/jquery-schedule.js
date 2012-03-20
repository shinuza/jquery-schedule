/**


Copyright (c) 2012 Samori Gorse, @shinuza

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**/


;(function($) {
    "use strict";

    var VERSION = '0.1.10-3';

    var MARK = 'mark';
    var LABEL = 'label';
    var CURSOR  = 'cursor';
    var SCHEDULE = 'schedule-scale-';

    function Schedule(element, options) {
        this.base = $(element);
        this.setOptions(options);
        this.elements = [];
        this.date = new Date;

        this.boundary = this.options.boundary;
        this.onTick = this.options.onTick;
        this.onDraw = this.options.onDraw;
        this.onLabel = this.options.onLabel;

        this.interval = null;
        this.lastUpdate = new Date();

        this._draw();
        this._drawCursor();

        if(this.options.tick === true) {
            this.tick();
        }
    }

             
    Schedule.prototype = {
        options: {
            onTick: $.noop,
            onDraw: $.noop,
            onLabel: function(v) {return v},
            start: 0,
            end: 24,
            scale: 2,
            boundary: 'both'
        },

        setOptions: function(options) {
            var option;
            options = options || {};
            for(option in options) {
                this.options[option] = options[option];
            }
            return this;
        },

        refresh: function(options) {
            var i, l, element;

            this._clearMarks();
            this._clearLabels();
            this.setOptions(options);

            // jQuery's each sucks
            for(i = 0, l = this.elements.length; i < l; i += 1) {
                element = this.elements[i];
                if(element !== undefined) {
                    this._positionElement(element);
                }
            }

            // TODO: Only remove custom class attributes
            this.base.attr('class', '');
            this._draw();
            return this;
        },

        tick: function() {
            var self = this;
            this.untick();

            this.interval = setInterval(function() {
                var currentDate = new Date();
                if(self.lastUpdate.getMinutes() != currentDate.getMinutes()) {
                    self.lastUpdate = currentDate;
                    self.cursor.data('date', self.lastUpdate);
                    self._positionElement(self.cursor);
                    self.onTick(self.lastUpdate);
                }
                
            }, 500);
            return this;
        },

        untick: function() {
            clearInterval(this.interval);
        },

        addElement: function(element, date, top) {
            element = $(element).data({
                'date': date,
                'top': top
            });
            this._positionElement(element);
            this.elements.push(element);
            this.base.append(element);
            return this;
        },

        removeElement: function(element) {
            var index = this._indexOf(element);
            if(~index) {
                delete this.elements[index];
                element.remove();
            }
            return this;
        },

        clear: function() {
            var i, l;
            for(i = 0, l = this.elements.length; i < l; i += 1) {
                if(this.elements[i] !== undefined) {
                    this.removeElement(this.elements[i]);
                }
            }
            return this;
        },

        getStart: function() {
            return this.options.start;
        },

        getEnd: function() {
            return this.options.end;
        },

        getVersion: function() {
            return VERSION;  
        },

        focusOn: function(element, scrolling, offset) {
            var left;
            scrolling = $(scrolling) || this.base;
            element = element === 'cursor' ? this.cursor : $(element);

            if(this._hasElement(element)) {
                left = Math.round(element.position().left + (offset | 0));
                scrolling.scrollLeft(left);
            }
        },

        _indexOf: function(element) {
            var i, l, o;
            o = element.get(0);
            for(i = 0, l = this.elements.length; i < l; i += 1) {
                if(this.elements[i] !== undefined && this.elements[i].get(0) == o) {
                    return i;
                }
            }
            return -1;
        },

        _hasElement: function(element) {
            return !!~this._indexOf(element);
        },

        _drawMark: function(num) {
            var mark = this._createElement(MARK, '');
            mark.height(this.base.height());
            mark.css('left', num * 60 * this.options.scale);
            this.base.append(mark);
        },

        _clearMarks: function() {
            this._clearElements(MARK);
        },

        _drawLabel: function(num) {
            var text = this.onLabel(num + this.options.start);
            var label = this._createElement(LABEL, text);
            this.base.append(label);
            label.css('left', (num * 60 * this.options.scale) - label.width() / 2 );
        },

        _clearLabels: function() {
            this._clearElements(LABEL);
        },

        _drawCursor: function() {
            this.cursor = $('<div class="' + CURSOR + '"></div>');
            this.cursor.height(this.base.height());
            this.addElement(this.cursor, this.date, null);
        },

        _draw: function() {
            var scale = this.options.scale,
                start = this.options.start,
                end = this.options.end,
                b = this.options.boundary,
                n = end - start;

            var width =  (end - start + (~~ b == 'both')) * 60 * scale;
            this.base.addClass(SCHEDULE + scale).width(width);

            var i = 0, j = n + 1;
            if(b == 'start') j = n;
            if(b == 'end') i = 1;

            for(; i < j; i += 1) {
                this._drawMark(i);
                this._drawLabel(i);
            }

            this.onDraw(this.options);
        },

        _clearElements: function(cls) {
            this.base.find('.' + cls).remove();
        },

        _dateAsPixels: function(date) {
            var hours = (date.getHours() - this.options.start) * 60 * this.options.scale;
            var minutes = date.getMinutes() * this.options.scale;
            return hours + minutes;
        },
  
        _createElement: function(className, html) {
            return $('<div class="' + className + '">' + html + '</div>');
        },

        _positionElement: function(element) {
            element.css({
                'left': this._dateAsPixels(element.data('date')),
                'top': element.data('top')
            });
        }

    };

    $.fn.schedule = function(options) {
        return new Schedule(this, options);
    };
        
})(jQuery);
