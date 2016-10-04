/**
 * A tile object containing tile ID, tileset ID and custom properties.
 */
export class Tile {
	/**
	 * Tile constructor.
	 *
	 * @param {object|string} options={} Options for the tile. Can also be tile data you loaded from JSON or a plain string in the following format: <tileId:tilesetId>
	 * @param {number} options.tileId - {@link Tile#tileId}
	 * @param {number} options.tilesetId - {@link Tile#tilesetId}
	 * @param {Map<string, *>} [options.properties={}] - {@link Tile#properties}
	 */
	constructor(options) {
		/** The tile ID of the tile.
		 * @type {number} */
		this.tileId = undefined;

		/** The tileset ID of the tile.
		 * @type {number} */
		this.tilesetId = undefined;

		if (typeof options === "string") {
			const colonIndex = options.indexOf(":");
			this.tileId = parseInt(options.substring(0, colonIndex));
			this.tilesetId = parseInt(options.substring(colonIndex + 1));
		} else {
			this.tileId = options.tileId;
			this.tilesetId = options.tilesetId;
		}

		/** Custom properties of the tile.
		 * @type {Map<string, *>} */
		this.properties = options.properties || new Map();
	}
}
