/**
 * An object representing generic properties most things in a TileMap can have.
 */
export class PropertyObject {
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
		this._map = new Map();
		for (let [key, value] of properties) {
			this.set(key, value);
		}
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
			this._map.set(key, value);
		} else {
			throw TypeError("Invalid key or value");
		}
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
