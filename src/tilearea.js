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

	/**
	 * Gets the index of a tile in the tile array from a position.
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
		return y * this.width + x;
	}

	/**
	 * Gets an area of tiles.
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

	/**
	 * Inserts a TileArea into this TileArea.
	 *
	 * This isertion does not fail if it goes outside of the TileArea.
	 *
	 * @param {number} x - Top left x coordinate of where the TileArea should be inserted.
	 * @param {number} y - Top left y coordinate of where the TileArea should be inserted.
	 * @param {TileArea} tileArea - The TileArea to be inserted.
	 * @param {boolean} skipEmpty - If the insertion should skip empty (-1) tiles.
	 */
	insertTileArea(x, y, tileArea, skipEmpty) {
		for (let lx = x; lx < x + tileArea.width; lx++) {
			for (let ly = y; ly < y + tileArea.height; ly++) {
				try {
					const newTile = tileArea.tiles[tileArea.getTileIndex(lx - x, ly - y)];
					if (skipEmpty && newTile.tileId === -1) continue;
					this.tiles[this.getTileIndex(lx, ly)] = newTile;
				} catch (e) {
					if (e instanceof RangeError) continue; else throw e;
				}
			}
		}
	}

	_inRange(x, y, width = 1, height = 1) {
		return !(x < 0 || x >= this.width ||
			y < 0 || y > this.height ||
			width <= 0 || x + width > this.width ||
			height <= 0 || y + height > this.height
		);
	}
}
