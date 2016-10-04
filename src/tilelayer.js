import { Tile } from "./tile";

/**
 * A tile layer object containing tiles and other properties.
 */
export class TileLayer {
	/**
	 * TileLayer constructor.
	 *
	 * @param {TileMap} parentMap - The parent map for this layer.
	 * @param {object} options - Options for the layer. Can also be layer data you loaded from JSON or similar.
	 * @param {string} [options.name="Tilelayer"] - {@link TileLayer#name}
	 * @param {Tile[]} options.tiles=[] - {@link TileLayer#tiles}
	 * @param {Map<string, *>} options.properties=Map - {@link TileLayer#properties}
	 */
	constructor(parentMap, options = {}) {
		/** The name of the tile layer.
		 * @type {string} */
		this.name = options.name || "Tilelayer";

		/** The tiles of the layer.
		 * @type {Tile[]} */
		this.tiles = [];
		for (let y = 0; y < parentMap.height; y++) {
			for (let x = 0; x < parentMap.width; x++) {
				const tile = new Tile(
					options.tiles
					? options.tiles[x % parentMap.width + y * parentMap.width]
					: {}
				);
				this.tiles.push(tile);
			}
		}

		/** Custom properties of the layer.
		 * @type {Map<string, *>} */
		this.properties = options.properties || new Map();

		this._width = parentMap.width;
		this._height = parentMap.height;
	}

	/**
	 * Gets the index of a tile in the main tile array from a position
	 *
	 * @param {number} x - The x coordinate of the tile.
	 * @param {number} y - The y coordinate of the tile.
	 *
	 * @returns {number} The index of the tile in the main array.
	 */
	getTileIndex(x, y) {
		if (x < 0 || x >= this._width || y < 0 || y > this._height) {
			throw new RangeError();
		}
		return y * this._width + x;
	}
}
