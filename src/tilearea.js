import { Tile } from "./tile";

import { EventEmitter } from "./event";

/**
 * A tile area object with a size and tiles.
 */
export class TileArea extends EventEmitter {
	/**
	 * TileArea constructor.
	 *
	 * @param {number} width - {@link TileArea#width}
	 * @param {number} height - {@link TileArea#height}
	 * @param {Tile[]} tiles - {@link TileArea#tiles}
	 */
	constructor(width, height, tiles) {
		super();

		/** The width of the tile area.
		 * @type {number} */
		this.width = width;
		/** The height of the tile area.
		 * @type {number} */
		this.height = height;

		/** The tiles in the tile area
		 * @type {Tile[]} */
		this.tiles = tiles.map(tile => {
			if (!(tile instanceof Tile)) {
				throw new TypeError("All tiles in a TileArea has to be of the Tile type.");
			}
			return tile;
		});

		if (this.width * this.height !== this.tiles.length) {
			throw new RangeError("The width and height doesn't match the amount of tiles given.");
		}
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

					this.tiles[this.getTileIndex(lx, ly)]
						.setData(newTile.tileId, newTile.tilesetId);
				} catch (e) {
					if (e instanceof RangeError) continue; else throw e;
				}
			}
		}
	}

	/**
	 * Resizes the TileArea, inserting empty tiles if grown and removing tiles if shrunk.
	 *
	 * Keep in mind that this function is currently really slow. It works, but it's just
	 * very slow. Just ping me or send a PR if you need it to be faster. For now
	 * though, don't call it every frame, but rather once you're certain you need
	 * to resize.
	 *
	 * @param {number} width - The new width of the TileArea.
	 * @param {number} height - The new height of the TileArea.
	 */
	resize(width, height) {
		// Shrink
		if (width < this.width) {
			this.tiles = this.getTileArea(0, 0, width, this.height).tiles;
			this.width = width;
		}
		if (height < this.height) {
			this.tiles = this.getTileArea(0, 0, this.width, height).tiles;
			this.height = height;
		}

		// Grow
		if (width > this.width) {
			let offset = 0;
			for (let y = 0; y < this.height; y++) {
				const startIndex = this.getTileIndex(this.width - 1, y) + offset + 1;
				for (let x = 0; x < width - this.width; x++) {
					this.tiles.splice(startIndex + x, 0, new Tile());
					offset++;
				}
			}
			this.width = width;
		}
		if (height > this.height) {
			let offset = 0;
			for (let y = this.height; y < height; y++) {
				const startIndex = this.getTileIndex(this.width - 1, this.height - 1) + offset + 1;
				for (let x = 0; x < this.width; x++) {
					this.tiles.splice(startIndex + x, 0, new Tile());
					offset++;
				}
			}
			this.height = height;
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
