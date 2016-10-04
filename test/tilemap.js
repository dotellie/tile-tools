import { should as chaiShould } from "chai";

import { TileMap } from "../src";
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

			layers: [
				{}, {}, {}
			]
		});
	});

	/** @test {TileMap#constructor} */
	describe("#create", () => {
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
	});
});
