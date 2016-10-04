/**
 * A tile area object with a size and tiles.
 */
export class TileArea {
	/**
	 * TileArea constructor.
	 *
	 * @param {number} width - {@link TileArea#width}
	 * @param {number} height - {@link TileArea#height}
	 * @param {Tile[]} tiles - {@link TileArea#tiles}
	 */
	constructor(width, height, tiles) {
		/** The width of the tile area.
		 * @type {number} */
		this.width = width;
		/** The height of the tile area.
		 * @type {number} */
		this.height = height;

		/** The tiles in the tile area
		 * @type {Tile[]} */
		this.tiles = tiles;
	}
}
