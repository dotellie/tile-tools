/** @ignore */
export class EventEmitter {
	constructor() {
		this._listeners = [];
	}

	on(event, listener) {
		if (typeof event !== "string") {
			throw new TypeError("Event has to have a string as the name");
		} else if (typeof listener !== "function") {
			throw new TypeError("Listener has to be a function");
		}
		this._listeners.push([event, listener]);
	}

	off(event, listener) {
		const toRemove = [];
		this._listeners.forEach((ev, index) => {
			if (ev[0] === event && ev[1] === listener) {
				toRemove.push(index);
			}
		});
		toRemove.forEach(index => {
			this._listeners.splice(index, 1);
		});
	}

	emit(event, argument) {
		this._listeners.forEach(ev => {
			if (ev[0] === event) {
				ev[1](argument);
			}
		});
	}
}
