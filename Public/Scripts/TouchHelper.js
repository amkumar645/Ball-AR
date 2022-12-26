// TouchHelper.js
// Version: 0.0.1
// Event: Frame Update
// Description: The helper script that broadcasts touch events


function EventWrapper() {
    this._callbacks = [];
}

EventWrapper.prototype.addCallback = function(callback) {
    this._callbacks.push(callback);
};

EventWrapper.prototype.removeCallback = function(callback) {
    var ind = this._callbacks.indexOf(callback);
    if (ind > -1) {
        this._callbacks.splice(ind, 1);
    }
};

EventWrapper.prototype.trigger = function(arg0, arg1, arg2, extraArgs) {
    var callbacks = this._callbacks.slice();
    for (var i=0; i<callbacks.length; i++) {
        callbacks[i].apply(null, arguments);
    }
};

function TouchHelper(scriptComponent) {
    var onTouchStart = new EventWrapper(); 
    this.onTouchStart = onTouchStart;

    var onTouchMove = new EventWrapper();
    this.onTouchMove = onTouchMove;

    var onTouchEnd = new EventWrapper();
    this.onTouchEnd = onTouchEnd;

    scriptComponent.createEvent("TouchStartEvent").bind(function(args) {
        onTouchStart.trigger(args);
    });

    scriptComponent.createEvent("TouchMoveEvent").bind(function(args) {
        onTouchMove.trigger(args);
    });

    scriptComponent.createEvent("TouchEndEvent").bind(function(args) {
        onTouchEnd.trigger(args);
    });

}

global.TouchHelper = new TouchHelper(script);

