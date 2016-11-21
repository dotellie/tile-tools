import { TileLayer } from "./tilelayer";
import { TileSet } from "./tileset";
import { PropertyObject } from "./propertyObject";

/**
 * A tilemap object with name, sizes and layers.
 */
export class TileMap {
	/**
     * TileMap constructor.
     *
     * @param {object} options - Options for the tilemap. Can also be a tilemap you loaded from JSON or similar.
	 * @param {string} [options.name="Tilemap"] - {@link TileMap#name}
     * @param {number} options.width - {@link TileMap#width}
     * @param {number} options.height - {@link TileMap#height}
     * @param {number} options.tileWidth - {@link TileMap#tileWidth}
     * @param {number} options.tileHeight - {@link TileMap#tileHeight}
     * @param {layerOption[]} [options.layers=[]] - Same structure as options in {@link TileLayer#constructor}
     * @param {tilesetOption[]} [options.tilesets=[]] - Same structure as options in {@link TileSet#constructor}
	 * @param {Map<string, *>} [options.properties=Map] - {@link TileMap#properties}
     */
	constructor(options) {
		/** The name of the tilemap.
		 * @type {string} */
		this.name = options.name || "Tilemap";

		this._width = options.width;
		this._height = options.height;

		/** The width of a tile for the tilemap.
		 * @type {number} */
		this.tileWidth = options.tileWidth;
		/** The height of a tile for the tilemap.
		 * @type {number} */
		this.tileHeight = options.tileHeight;

		/** All layers of the tilemap
		 *  @type {TileLayer[]} */
		this.layers = [];
		options.layers = options.layers || [];
		for (let layerData of options.layers) {
			this.createLayer(layerData);
		}

		/** The tilesets the tilemap consists of.
		 * @type {TileSet[]} */
		this.tilesets = [];
		options.tilesets = options.tilesets || [];
		for (let tileset of options.tilesets) {
			this.addTileset(new TileSet(tileset));
		}

		/** Custom properties of the tilemap.
		 * @type {PropertyObject} */
		this.properties = new PropertyObject(options.properties);
	}

	/** The width of the tilemap.
	 * @type {number} */
	get width() {
		return this._width;
	}
	/** The height of the tilemap.
	 * @type {number} */
	get height() {
		return this._height;
	}

	/**
	 * Resizes the TileMap, inserting empty tiles if grown and removing tiles if shrunk.
	 *
	 * PLEASE NOTE: As explained {@link TileArea#resize}, this function is slow
	 * on just one TileArea (layer), so you can imagine what'll happen if you call
	 * this on just 4 150x150 layers...
	 *
	 * @param {number} width - The new width of the map.
	 * @param {number} height - The new height of the map.
	 */
	resize(width, height) {
		this._width = width;
		this._height = height;

		for (let layer of this.layers) {
			layer.resize(this._width, this._height);
		}
	}

	/**
	 * Creates a new layer and adds it to the tilemap.
	 *
	 * @param {object} options - Options for the layer (see {@link TileLayer}).
	 *
	 * @returns {TileLayer}
	 */
	createLayer(options) {
		const layer = new TileLayer(this, options);
		this.layers.push(layer);
		return layer;
	}

	/**
	 * Adds a tileset to the tilemap.
	 *
	 * @param {TileSet} tileset - the tileset to add to the map.
	 *
	 * @returns {TileSet}
	 */
	addTileset(tileset) {
		this.tilesets.push(tileset);
		return tileset;
	}

	/**
	 * Converts this tilemap to a JSON string.
	 *
	 * @returns {string} - The JSON serialization of this tilemap.
	 */
	getJSON() {
		return JSON.stringify(this, (key, value) => {
			if (key.indexOf("_") === 0) {
				return undefined;
			}
			return value;
		});
	}
}
