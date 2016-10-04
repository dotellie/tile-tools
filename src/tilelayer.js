import { Tile } from "./tile";
import { TileArea } from "./tilearea";

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
		if (!this._inRange(x, y)) {
			throw new RangeError();
		}
		return y * this._width + x;
	}

	/**
	 * Get an area of tiles.
	 *
	 * @param {number} x - The x coordinate of the tile area.
	 * @param {number} y - The y coordinate of the tile area.
	 * @param {number} width - The width of the tile area.
	 * @param {number} height - The height of the tile area.
	 *
	 * @returns {TileArea} A {@link TileArea} of the area requested.
	 */
	getTileArea(x, y, width, height) {
		if (!this._inRange(x, y, width, height)) {
			throw new RangeError();
		}
		const tiles = [];
		for (let ly = y; ly < y + height; ly++) {
			for (let lx = x; lx < x + width; lx++) {
				tiles.push(this.tiles[this.getTileIndex(lx, ly)]);
			}
		}
		return new TileArea(width, height, tiles);
	}

	_inRange(x, y, width = 1, height = 1) {
		return !(x < 0 || x >= this._width ||
			y < 0 || y > this._height ||
			width <= 0 || x + width > this._width ||
			height <= 0 || y + height > this._height
		);
	}
}
