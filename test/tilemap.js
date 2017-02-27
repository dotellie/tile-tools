import { should as chaiShould } from "chai";

import { TileMap, MapObject } from "../src";
import testmap from "./testmap";

const should = chaiShould();

/** @test {TileMap} */
describe("TileMap", () => {
	const mapName = "a map name",
		mapWidth = 10,
		mapHeight = 10,
		tileWidth = 16,
		tileHeight = 16;

	let tilemap;

	beforeEach(() => {
		tilemap = new TileMap({
			name: mapName,
			width: mapWidth,
			height: mapHeight,
			tileWidth,
			tileHeight,

			tilesets: [
				{}
			],

			layers: [
				{}, {}, {}
			],

			objects: [
				{ name: "an object" },
				{}
			]
		});
	});

	/** @test {TileMap#constructor} */
	describe("#constructor", () => {
		it("has a name", () => {
			tilemap.name.should.equal(mapName);
		});
		it("has dimmensions", () => {
			tilemap.width.should.be.a("number");
			tilemap.height.should.be.a("number");

			tilemap.width.should.equal(mapWidth);
			tilemap.height.should.equal(mapHeight);
		});
		it("has tile size", () => {
			tilemap.tileWidth.should.be.a("number");
			tilemap.tileHeight.should.be.a("number");
		});
		it("has layers", () => {
			tilemap.layers.should.have.length(3);
		});
		it("has properties for layers", () => {
			tilemap.layers[0].name.should.be.a("string");
		});
		it("reads a valid tilemap JSON", () => {
			tilemap = new TileMap(testmap);
			tilemap.name.should.equal("test map");
			tilemap.layers[0].tiles[23].tileId.should.equal(1);
		});
		it("has correct default values", () => {
			const tilemap = new TileMap({});
			tilemap.name.should.be.a("string");
			tilemap.layers.should.be.an("array");
			tilemap.objects.should.be.an("array");
		});
		it("can take map objects as input", () => {
			tilemap.objects.length.should.equal(2);
			tilemap.objects[0].name.should.equal("an object");
		});
	});

	/** @test {TileMap#resize} */
	describe("#resize", () => {
		const newWidth = mapWidth / 2, newHeight = mapHeight / 2;
		beforeEach(() => {
			tilemap.resize(newWidth, newHeight);
		});

		it("changes the size of the map", () => {
			tilemap.width.should.equal(newWidth);
			tilemap.height.should.equal(newHeight);
		});
		it("changes the size of all layers", () => {
			for (let layer of tilemap.layers) {
				layer.width.should.equal(newWidth);
				layer.height.should.equal(newHeight);
			}
		});
	});

	/** @test {TileMap#takeDataBuffer} */
	describe("#takeDataBuffer", () => {
		it("returns empty array when no change has happened", () => {
			tilemap.takeDataBuffer().should.deep.equal([]);
		});
		it("returns both new and old data values", () => {
			tilemap.layers[0].tiles[10].setData(5, 10);
			tilemap.layers[1].tiles[20].setData(10, 20);
			tilemap.layers[2].tiles[30].setData(20, 40);

			tilemap.takeDataBuffer().should.deep.equal([
				{ layer: 0, id: 10, old: { tileId: -1, tilesetId: 0 }, new: { tileId: 5, tilesetId: 10 } },
				{ layer: 1, id: 20, old: { tileId: -1, tilesetId: 0 }, new: { tileId: 10, tilesetId: 20 } },
				{ layer: 2, id: 30, old: { tileId: -1, tilesetId: 0 }, new: { tileId: 20, tilesetId: 40 } }
			]);
		});
		it("returns both new and old property values when setting", () => {
			tilemap.layers[0].tiles[5].properties.set("hi", "hello");
			tilemap.takeDataBuffer().should.deep.equal([
				{ layer: 0, id: 5, key: "hi", new: "hello" }
			]);
			tilemap.layers[0].tiles[5].properties.set("hi", "something");
			tilemap.takeDataBuffer().should.deep.equal([
				{ layer: 0, id: 5, key: "hi", old: "hello", new: "something" }
			]);

			tilemap.layers[0].properties.set("layer", "property");
			tilemap.takeDataBuffer().should.deep.equal([
				{ layer: 0, key: "layer", new: "property" }
			]);
			tilemap.layers[0].properties.set("layer", "again");
			tilemap.takeDataBuffer().should.deep.equal([
				{ layer: 0, key: "layer", old: "property", new: "again" }
			]);

			tilemap.objects[0].properties.set("objects", "yup");
			tilemap.takeDataBuffer().should.deep.equal([
				{ object: 0, key: "objects", new: "yup" }
			]);
			tilemap.objects[0].properties.set("objects", "again");
			tilemap.takeDataBuffer().should.deep.equal([
				{ object: 0, key: "objects", old: "yup", new: "again" }
			]);

			tilemap.tilesets[0].properties.set("tilesets", "even");
			tilemap.takeDataBuffer().should.deep.equal([
				{ tileset: 0, key: "tilesets", new: "even" }
			]);
			tilemap.tilesets[0].properties.set("tilesets", "again");
			tilemap.takeDataBuffer().should.deep.equal([
				{ tileset: 0, key: "tilesets", old: "even", new: "again" }
			]);

			tilemap.properties.set("map", "too");
			tilemap.takeDataBuffer().should.deep.equal([
				{ key: "map", new: "too" }
			]);
			tilemap.properties.set("map", "again");
			tilemap.takeDataBuffer().should.deep.equal([
				{ key: "map", old: "too", new: "again" }
			]);
		});
		it("still adds entries after complex operations", () => {
			tilemap.objects.push(new MapObject());
			tilemap.objects[1].properties.set("hi", "yo");
			tilemap.takeDataBuffer().should.deep.equal([
				{ object: 1, key: "hi", new: "yo" }
			]);
		});
		it("empties data buffer when taken", () => {
			tilemap.layers[0].tiles[25].setData(1, 1);
			tilemap.takeDataBuffer();
			tilemap.takeDataBuffer().should.deep.equal([]);
		});
	});

	/** @test {TileMap#getJSON} */
	describe("#getJSON", () => {
		it("returns a valid JSON string", () => {
			JSON.parse(tilemap.getJSON());
		});
		it("doesn't parse private properties", () => {
			tilemap._property = "foo";
			should.not.exist(JSON.parse(tilemap.getJSON())._property);
		});
		it("can be parsed back to a map object", () => {
			(() => {
				// eslint-disable-next-line no-new
				new TileMap(JSON.parse(tilemap.getJSON()));
			}).should.not.throw(Error);
		});
		it("still has width and height properties after parsing", () => {
			const map = JSON.parse(tilemap.getJSON());
			map.width.should.be.a("number");
			map.height.should.be.a("number");
		});
	});
});
