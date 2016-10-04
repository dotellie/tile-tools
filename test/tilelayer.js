import { should } from "chai";

import { TileMap } from "../src";

should();

/** @test {TileLayer} */
describe("TileLayer", () => {
	const mapWidth = 100, mapHeight = 100;
	let tilelayer;

	beforeEach(() => {
		tilelayer = new TileMap({
			width: mapWidth,
			height: mapHeight,
			layers: [{}]
		}).layers[0];
	});

	/** @test {TileLayer#getTileIndex} */
	describe("#getTileIndex", () => {
		it("returns the right index", () => {
			tilelayer.getTileIndex(16, 56).should.equal(5616);
			tilelayer.getTileIndex(76, 32).should.equal(3276);
		});
		it("crashes if out of bounds", () => {
			(() => {
				tilelayer.getTileIndex(mapWidth, 0);
			}).should.throw(RangeError);
			(() => {
				tilelayer.getTileIndex(-1, 0);
			}).should.throw(RangeError);
		});
	});
});
