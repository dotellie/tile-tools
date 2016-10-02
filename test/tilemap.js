/* global: describe, it */

import { should } from "chai";

import { TileMap } from "../src";

should();

/** @test {TileMap} */
describe("TileMap", () => {
	const mapName = "a map name",
		mapWidth = 100,
		mapHeight = 100,
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
	});

	describe("#toJSON", () => {
		it("returns a valid JSON string", () => {
			JSON.parse(tilemap.getJSON());
		});
	});
});
