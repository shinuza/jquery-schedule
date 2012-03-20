jQuery Schedule
---------------

## Usage

$(myelement).schedule(options);

## Options

scale - int - Initial scale to render, defaults to 1

start - int - Hour marker to start from, defaults to 0

end - int - Hour to end to, defaults to 24 (non-inclusive)

boundary - string - `start`, `end` or `both`. Which boundary to display.

## Methods

tick() - Start to track the time, the cursor is automatically updated every minutes

refresh(options) - Redraws the schedule with the new given options

reDraw - Alias to refresh()

getStart - Returns the start

getEnd - Returns the end

addElement(element, date, top) - Add an element to the timeline, X is defined using a date, top is in pixels

removeElement(element) - Prefered way to remove an element from the timeline.

clear() - Clears the timeline

## Events

onTick(Date) - fired when the cursor is updated

onDraw(options) - fired when the schedule is drawn

onLabel(num) - fired when drawing a label, you can modify the label there