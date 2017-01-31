import { EventEmitter } from "./event.js";

/**
 * An object representing generic properties most things in a TileMap can have.
 */
export class PropertyObject extends EventEmitter {
	/**
	 * PropertyObject constructor.
	 *
	 * @param {[[key, value]]} properties - The default properties for this object expressed in key value pairs.
	 *
	 * @example
	 * // The value part of the key value array can litterally be anything that
	 * // you can serialize to JSON. In this case, we use a string and another
	 * // array containing an object.
	 * const properties = new PropertyObject(
	 *     [["environment", "spooky"], ["connections", [
	 *         { map: "otherMap", location: "top", xOffset: 5 }
	 *     ]]]
	 * );
	 */
	constructor(properties) {
		super();

		this._map = new Map();

		if (!properties) return;
		let array;
		if (properties instanceof PropertyObject) {
			array = properties.getAll();
		} else if (properties instanceof Array) {
			array = properties;
		} else {
			throw new TypeError("A property object can not be created from object of type " + typeof properties);
		}
		for (let [key, value] of array) {
			this.set(key, value);
		}
	}

	/**
	 * Gets the amount of properties in the object.
	 *
	 * @returns {number} The amount of properties.
	 */
	get size() {
		return this._map.size;
	}

	/**
	 * Gets a value from the properties.
	 *
	 * @param {string} key - The key of the value.
	 *
	 * @returns The value that is assigned to the key. Will be undefined if no value has been assigned yet.
	 */
	get(key) {
		if (typeof key !== "string") throw new TypeError("Key has to be a string");
		return this._map.get(key);
	}

	/**
	 * Gets all properties of this object.
	 *
	 * @returns A key-value pair 2D array. [[k, v], [k, v]... etc.]
	 */
	getAll() {
		const toReturn = [];
		for (let value of this._map) {
			toReturn.push(value);
		}
		return toReturn;
	}

	/**
	 * Sets a property of this object.
	 *
	 * This will throw an error if types are invalid. Keys have to be strings and
	 * values have to be serializable into JSON.
	 *
	 * @param {string} key - The desired key of the property.
	 * @param value - The desired value of the property.
	 */
	set(key, value) {
		if (typeof key === "string" && JSON.stringify(value)) {
			if (key === "") return;
			const before = [key, this._map.get(key)];
			this._map.set(key, value);

			this.emit("property-change", {
				data: [before, [key, value]],
				object: this
			});
		} else {
			throw TypeError("Invalid key or value");
		}
	}

	/**
	 * Removes a property from the properties.
	 *
	 * @param {string} key - The key of the property to remove.
	 */
	remove(key) {
		const before = [key, this._map.get(key)];

		this._map.delete(key);

		this.emit("property-change", {
			data: [before, [undefined, undefined]],
			object: this
		});
	}

	/**
	 * Generates a JSON compatible value from this object.
	 *
	 * @returns An array to represent this object.
	 */
	toJSON() {
		return this.getAll();
	}
}
