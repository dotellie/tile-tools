import { PropertyObject } from "./propertyObject";

/**
 * A tileset object for storing arbitrary information about tilesets.
 */
export class TileSet {
	/**
	 * TileSet constructor.
	 *
	 * @param {object} options - The options for the tileset.
	 * @param {string} [options.name="Tileset"] - {@link TileSet#name}
	 * @param {string} [options.type="test"] - {@link TileSet#type}
	 * @param {string} [options.path] - {@link TileSet#path}
	 * @param {Map<string, *>} [options.properties] - {@link TileSet#properties}
	 * @param {object} [options.tileProperties={}] - Default tile properties for the tileset.
	 */
	constructor({ name = "Tileset", type = "test", path, properties, tileProperties = {} }) {
		/** The name of the tileset.
		 * @type {string} */
		this.name = name;
		/** The type of the tileset.
		 * Possible values are: "test", "image"
		 * @type {string} */
		this.type = type;
		/** The path of the tileset.
		 * This should only be used if tileset type is set to "image".
		 * @type {string} */
		this.path = path;

		/** Custom properties of the tilemap.
		 * @type {Map<string, *>} */
		this.properties = properties || new Map();

		this._tileProperties = {};
		for (let key of Object.keys(tileProperties)) {
			key = parseInt(key);
			if (isNaN(key)) {
				throw new TypeError("Tile property keys have to be numbers");
			}
			const value = tileProperties[key];
			this._tileProperties[key] = new PropertyObject(value);
		}
	}

	/**
	 * Gets a PropertyObject for a tile ID on the TileSet.
	 *
	 * @param {number} id - The tileID to get the PropertyObject for.
	 *
	 * @returns {PropertyObject} The PropertyObject beloning to this tile ID.
	 *
	 * @throws {TypeError} Throws a TypeError if id isn't a number.
	 * @throws {RangeError} Throws a RangeError if there isn't a PropertyObject for the ID.
	 */
	getTileProperties(id) {
		if (typeof id !== "number") {
			throw new TypeError("ID has to be a number");
		}
		if (!this.hasTileProperties(id)) {
			throw new RangeError("There are no properties for tile ID " + id);
		}

		return this._tileProperties[id];
	}

	/**
	 * Creates a PropertyObject if needed and returns it.
	 *
	 * @param {number} id - The tileID to create the PropertyObject for.
	 *
	 * @returns {?PropertyObject} The created PropertyObject or undefined if it already existed.
	 *
	 * @throws {TypeError} Throws a TypeError if id isn't a number.
	 */
	createTileProperties(id) {
		if (typeof id !== "number") {
			throw new TypeError("ID has to be a number");
		}
		if (!this.hasTileProperties(id)) {
			this._tileProperties[id] = new PropertyObject();
			return this._tileProperties[id];
		}
	}

	/**
	 * Checks if a PropertyObject exists for an ID.
	 *
	 * @param {number} id - The tileID to check for a PropertyObject.
	 *
	 * @returns {boolean}
	 *
	 * @throws {TypeError} Throws a TypeError if id isn't a number.
	 */
	hasTileProperties(id) {
		if (typeof id !== "number") {
			throw new TypeError("ID has to be a number");
		}
		return typeof this._tileProperties[id] !== "undefined";
	}
}
