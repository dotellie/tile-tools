import { PropertyObject } from "./propertyObject";
import { EventEmitter } from "./event.js";

/**
 * An object with properties that's not bound to a tilemap's grid.
 */
export class MapObject extends EventEmitter {
	/**
	 * MapObject constructor.
	 *
	 * @param {object} options={} - Options for the MapObject.
	 * @param {string} options.name="" - {@link MapObject#name}
	 * @param {number} options.x=0 - {@link MapObject#x}
	 * @param {number} options.y=0 - {@link MapObject#y}
	 * @param {number} options.width=1 - {@link MapObject#width}
	 * @param {number} options.height=1 - {@link MapObject#height}
	 * @param {string[][]} [options.properties] - {@link PropertyObject#constructor}
	 */
	constructor({ name = "", x = 0, y = 0, width = 1, height = 1, properties } = {}) {
		super();

		/** The name for the MapObject.
		 * @type {string} */
		this.name = name;
		/** The x value for the position of this MapObject.
		 * @type {number} */
		this.x = x;
		/** The y value for the position of this MapObject.
		 * @type {number} */
		this.y = y;

		if (width <= 0 || height <= 0) throw new RangeError("Rectangle is invalid!");
		/** The width of the MapObject.
		 * @type {number} */
		this.width = width;
		/** The height of the MapObject.
		 * @type {number} */
		this.height = height;

		/** Custom properties of the MapObject.
		 * @type {PropertyObject} */
		this.properties = new PropertyObject(properties);

		// Property Events
		this.forward(this.properties, "property-change");
	}

	/**
	 * Creates a clone out of this MapObject.
	 *
	 * @returns {MapObject} The new MapObject.
	 */
	clone() {
		return new MapObject(this);
	}
}
