/**
 * An observable array, meant for dealing with events coming from all objects
 * in a constantly changing array.
 *
 * In its current implementation, an ObservableArray only supports push and splice.
 */
export class ObservableArray extends Array {
	/**
	 * @callback eventCallback
	 * @param {object} argument
	 */

	/**
	 * ObservableArray constructor.
	 *
	 * @param {string} eventName - The event name to listen for events on.
	 * @param {eventCallback} callback - Callback for when event is emitted.
	 */
	constructor(eventName, callback) {
		super();

		this._eventName = eventName;
		this._callback = callback;

		this._callbacks = new Map();
	}

	/**
	 * Pushes elements onto the array and starts listening to events on them.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push|MDN}
	 */
	push(...items) {
		this.splice(this.length, 0, ...items);
	}

	/**
	 * Removes and adds elements onto the array, starting and stopping listening
	 * to events.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice|MDN}
	 */
	splice(index, howMany, ...items) {
		for (let i = index; i < index + howMany; i++) {
			const item = this[i];
			item.off(this._eventName, this._callbacks.get(item));
			this._callbacks.delete(item);
		}

		super.splice(index, howMany, ...items);

		items.forEach(item => {
			const callback = e => {
				const index = this.indexOf(item);
				const event = {
					model: { item, index },
					detail: e
				};
				this._callback(event);
			};
			this._callbacks.set(item, callback);
			item.on(this._eventName, callback);
		});
	}
}
