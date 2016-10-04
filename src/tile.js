/**
 * A tile object containing tile ID, tileset ID and custom properties.
 */
export class Tile {
	/**
	 * Tile constructor.
	 *
	 * @param {object} options={} Options for the tile. Can also be tile data you loaded from JSON or similar.
	 * @param {number} options.tileId - {@link Tile#tileId}
	 * @param {number} options.tilesetId - {@link Tile#tilesetId}
	 * @param {Map<string, *>} [options.properties={}] - {@link Tile#properties}
	 */
	constructor(options) {
		/** The tile ID of the tile.
		 * @type {number} */
		this.tileId = options.tileId;

		/** The tileset ID of the tile.
		 * @type {number} */
		this.tilesetId = options.tilesetId;

		/** Custom properties of the tile.
		 * @type {Map<string, *>} */
		this.properties = options.properties || new Map();
	}
}
