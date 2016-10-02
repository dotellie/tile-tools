import { TileLayer } from "./tilelayer";

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
	 * @param {Map<string, *>} [options.properties=Map] - {@link TileMap#properties}
     */
	constructor(options) {
		/** The name of the tilemap.
		 * @type {string} */
		this.name = options.name || "Tilemap";

		/** The width of the tilemap.
		 * @type {number} */
		this.width = options.width;
		/** The height of the tilemap.
		 * @type {number} */
		this.height = options.height;

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

		/** Custom properties of the tilemap.
		 * @type {Map<string, *>} */
		this.properties = options.properties || new Map();
	}

	/**
	 * Creates a new layer and adds it to the tilemap.
	 *
	 * @param {object} options - Options for the layer (see {@link TileLayer}).
	 *
	 * @returns {TileLayer}
	 */
	createLayer(options) {
		const layer = new TileLayer(options);
		this.layers.push(layer);
		return layer;
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
