jQuery Schedule
---------------

## Usage

$(myelement).schedule(options);

## Options

scale - int - Initial scale to render, defaults to 1

start - int - Hour marker to start from, defaults to 0

end - int - Hour to end to, defaults to 24 (non-inclusive)

boundaries - string - `start`, `end` or `both`. Which boundary to display.

## Methods

tick() - Start to track the time, the cursor is automatically updated every minutes

refresh(options) - Redraws the schedule with the new given options

reDraw - Alias to refresh()

getStart - Returns the start

getEnd - Returns the end

## Events

onTick(Date) - fired when the cursor is updated

onDraw(options) - fired when the schedule is drawn