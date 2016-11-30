import { Tile } from "./tile";
import { TileArea } from "./tilearea";
import { PropertyObject } from "./propertyObject";

/**
 * A tile layer object containing tiles and other properties.
 */
export class TileLayer extends TileArea {
	/**
	 * TileLayer constructor.
	 *
	 * @param {TileMap} parentMap - The parent map for this layer.
	 * @param {object} options - Options for the layer. Can also be layer data you loaded from JSON or similar.
	 * @param {string} [options.name="Tilelayer"] - {@link TileLayer#name}
	 * @param {Tile[]} options.tiles=[] - {@link TileLayer#tiles}
	 * @param {string[][]} [options.properties] - {@link PropertyObject#constructor}
	 */
	constructor(parentMap, options) {
		const tiles = [];
		for (let y = 0; y < parentMap.height; y++) {
			for (let x = 0; x < parentMap.width; x++) {
				const tile = new Tile(
					options.tiles
					? options.tiles[x % parentMap.width + y * parentMap.width]
					: { tileId: -1, tilesetId: 0 }
				);
				tiles.push(tile);
			}
		}

		super(parentMap.width, parentMap.height, tiles);

		/** The name of the tile layer.
		 * @type {string} */
		this.name = options.name || "Tilelayer";

		/** Custom properties of the layer.
		 * @type {PropertyObject} */
		this.properties = new PropertyObject(options.properties);
	}

	/**
	 * Returns an object to be serialized by JSON.stringify.
	 */
	toJSON() {
		const replacement = {};
		for (let key in this) {
			if (key === "width" || key === "height") continue;
			replacement[key] = this[key];
		}
		return replacement;
	}
}
