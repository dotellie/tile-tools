import { PropertyObject } from "./propertyObject";
import { EventEmitter } from "./event";

/**
 * A tile object containing tile ID, tileset ID and custom properties.
 */
export class Tile extends EventEmitter {
	/**
	 * Tile constructor.
	 *
	 * @param {object|string} options={} Options for the tile. Can also be tile data you loaded from JSON or a plain string in the following format: <tileId:tilesetId>
	 * @param {number} options.tileId=-1 - {@link Tile#tileId}
	 * @param {number} options.tilesetId=-1 - {@link Tile#tilesetId}
	 * @param {string[][]} [options.properties] - {@link PropertyObject#constructor}
	 */
	constructor(options = { tileId: -1, tilesetId: -1 }) {
		super();

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
		 * @type {PropertyObject} */
		this.properties = new PropertyObject(options.properties);
	}

	/**
	 * Whether the tile should emit events at all.
	 */
	set emitEvents(shouldEmit) {
		this._emitEvents = shouldEmit;

		this.properties.offAll("property-change");

		if (shouldEmit) {
			this.properties.on("property-change", e => {
				e.tile = this;
				this.emit("property-change", e);
			});
		}
	}

	/**
	 * Sets the data for this tile.
	 *
	 * @param {number} tileId - The ID to assign to the tile.
	 * @param {number} [tilesetId] - The tileset ID to assign to the tile.
	 * @param {boolean} [replaceEmpty] - Should values less than 0 (-1) be handled (true) or ignored (false).
	 */
	setData(tileId, tilesetId, replaceEmpty) {
		const before = {
			tileId: this.tileId, tilesetId: this.tilesetId
		};

		if (tileId >= 0 || replaceEmpty) {
			this.tileId = Math.max(tileId, -1);
		}
		if (tilesetId != null && (tilesetId >= 0 || replaceEmpty)) {
			this.tilesetId = Math.max(tilesetId, -1);
		}

		if (this._emitEvents) {
			this.emit("data-change", {
				old: before,
				new: {
					tileId: this.tileId, tilesetId: this.tilesetId
				},
				object: this
			});
		}
	}

	/**
	 * toJSON function used for JSON serialization.
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior
	 *
	 * @returns {Tile|string} Object to be serialized
	 */
	toJSON() {
		if (this.properties.size === 0) {
			return this.tileId + ":" + this.tilesetId;
		} else {
			return this;
		}
	}

	/**
	 * Creates a clone out of this tile.
	 *
	 * @returns {Tile} The new tile.
	 */
	clone() {
		return new Tile(this);
	}
}
