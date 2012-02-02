jQuery Schedule
---------------

## Usage

$(myelement).schedule(options);

## Options

scale - int - Initial scale to render, defaults to 1

start - int - Hour marker to start from, defaults to 0

end - int - Hour to end to, defaults to 24 (non-inclusive)

## Methods

tick() - Start to track the time, the cursor is automatically updated every minutes

refresh(options) - Redraws the schedule with the new given options

reDraw - Alias to refresh()

## Events

onTick(Date) - fired when the cursor is updated

onDraw(options) - fired when the schedule is drawn