/**
 * A tileset object for storing arbitrary information about tilesets.
 */
export class TileSet {
	/**
	 * TileSet constructor.
	 *
	 * @param {object} options - The options for the tileset.
	 * @param {string} [options.name="Tileset"] - {@link TileSet#name}
	 * @param {string} [options.type="test"] - {@link TileSet#type}
	 * @param {string} [options.path] - {@link TileSet#path}
	 * @param {Map<string, *>} [options.properties] - {@link TileSet@properties}
	 */
	constructor({ name = "Tileset", type = "test", path, properties }) {
		/** The name of the tileset.
		 * @type {string} */
		this.name = name;
		/** The type of the tileset.
		 * Possible values are: "test", "image"
		 * @type {string} */
		this.type = type;
		/** The path of the tileset.
		 * This should only be used if tileset type is set to "image".
		 * @type {string} */
		this.path = path;

		/** Custom properties of the tilemap.
		 * @type {Map<string, *>} */
		this.properties = properties || new Map();
	}
}
