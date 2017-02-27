import { TileLayer } from "./tilelayer";
import { TileSet } from "./tileset";
import { MapObject } from "./mapObject";
import { PropertyObject } from "./propertyObject";

import { ObservableArray } from "./observableArray";

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
	 * @param {objectOption[]} [options.objects] - Same structure as options in {@link MapObject#constructor}
     * @param {tilesetOption[]} [options.tilesets=[]] - Same structure as options in {@link TileSet#constructor}
	 * @param {string[][]} [options.properties] - {@link PropertyObject#constructor}
     */
	constructor({ name = "Tilemap", width, height, tileWidth, tileHeight,
		layers = [], objects = [], tilesets = [], properties }) {
		/** The name of the tilemap.
		 * @type {string} */
		this.name = name;

		this._width = width;
		this._height = height;

		/** The width of a tile for the tilemap.
		 * @type {number} */
		this.tileWidth = tileWidth;
		/** The height of a tile for the tilemap.
		 * @type {number} */
		this.tileHeight = tileHeight;

		const propertyChangeForwarder = ({ model, detail }, indexKey) => {
			detail[indexKey] = model.index;
			this._registerPropertyChange(detail, indexKey);
		};

		/** All layers of the tilemap
		 *  @type {TileLayer[]} */
		this.layers = new ObservableArray("property-change",
			e => propertyChangeForwarder(e, "layer"));
		layers.forEach(layer => this.createLayer(layer));

		/** All objects of the tilemap
		 * @type {MapObject[]} */
		this.objects = new ObservableArray("property-change",
			e => propertyChangeForwarder(e, "object"));
		this.objects.push(...(objects.map(object => new MapObject(object))));

		/** The tilesets the tilemap consists of.
		 * @type {TileSet[]} */
		this.tilesets = new ObservableArray("property-change",
			e => propertyChangeForwarder(e, "tileset"));
		tilesets.forEach(tileset => this.addTileset(new TileSet(tileset)));

		/** Custom properties of the tilemap.
		 * @type {PropertyObject} */
		this.properties = new PropertyObject(properties);

		this.properties.on("property-change", e => {
			const d = { key: e.key, new: e.new };
			if (e.old) d.old = e.old;
			this._dataBuffer.push(d);
		});

		this._dataBuffer = [];
	}

	/** The width of the tilemap.
	 * @type {number} */
	get width() {
		return this._width;
	}
	/** The height of the tilemap.
	 * @type {number} */
	get height() {
		return this._height;
	}

	/**
	 * Resizes the TileMap, inserting empty tiles if grown and removing tiles if shrunk.
	 *
	 * PLEASE NOTE: As explained {@link TileArea#resize}, this function is slow
	 * on just one TileArea (layer), so you can imagine what'll happen if you call
	 * this on just 4 150x150 layers...
	 *
	 * @param {number} width - The new width of the map.
	 * @param {number} height - The new height of the map.
	 */
	resize(width, height) {
		this._width = width;
		this._height = height;

		for (let layer of this.layers) {
			layer.resize(this._width, this._height);
		}
	}

	/**
	 * Creates a new layer and adds it to the tilemap.
	 *
	 * @param {object} options - Options for the layer (see {@link TileLayer}).
	 *
	 * @returns {TileLayer}
	 */
	createLayer(options) {
		const layer = new TileLayer(this, options);

		const layerIndex = this.layers.length;
		layer.on("tile-data-change", data => {
			this._dataBuffer.push({
				layer: layerIndex,
				id: data.tileId,
				old: data.old,
				new: data.new
			});
		});

		this.layers.push(layer);
		return layer;
	}

	/**
	 * Adds a tileset to the tilemap.
	 *
	 * @param {TileSet} tileset - the tileset to add to the map.
	 *
	 * @returns {TileSet}
	 */
	addTileset(tileset) {
		this.tilesets.push(tileset);
		return tileset;
	}

	/**
	 * Empties the data buffer. This is supposed to be used with undo/redo
	 * functionality.
	 *
	 * @returns The emptied data buffer as an Array. [layerId, tileId, [previousId, previousTilesetId], [newId, newTilesetId]]
	 */
	takeDataBuffer() {
		const toReturn = [].concat(this._dataBuffer);
		this._dataBuffer = [];
		return toReturn;
	}

	/**
	 * Converts this tilemap to a JSON string.
	 *
	 * @returns {string} - The JSON serialization of this tilemap.
	 */
	getJSON() {
		return JSON.stringify(this, (key, value) => {
			// Since width and height are getters, they don't get serialized.
			// Therefore, what is done here is that we check each property for
			// if it's a TileMap and if it is, we replace the _width and _height
			// property names with width and height (by substringing).
			if (value instanceof TileMap) {
				const replacement = {};
				for (let k in value) {
					const oldValue = value[k];
					if (k === "_width" || k === "_height") {
						k = k.substring(1);
					}
					replacement[k] = oldValue;
				}
				return replacement;
			}
			if (key.indexOf("_") === 0) {
				return undefined;
			}
			return value;
		});
	}

	_registerPropertyChange(e, indexKey) {
		const eventObject = {
			key: e.key,
			new: e.new
		};
		eventObject[indexKey] = e[indexKey];
		if (e.old) eventObject.old = e.old;
		if (e.tileId) eventObject.id = e.tileId;
		this._dataBuffer.push(eventObject);
	}
}
