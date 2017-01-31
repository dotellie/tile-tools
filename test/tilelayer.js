import { should as chaiShould } from "chai";

import { TileLayer } from "../src";

const should = chaiShould();

/** @test {TileLayer} */
describe("TileLayer", () => {
	/** @test {TileLayer#constructor} */
	describe("#constructor", () => {
		it("makes all tiles emit events", () => {
			const tileLayer = new TileLayer({
				width: 1, height: 2, tiles: ["0:0", "0:0"]
			}, {});
			tileLayer.tiles[0]._emitEvents.should.equal(true);
		});
	});

	/** @test {TileLayer#toJSON} */
	describe("#toJSON", () => {
		it("doesn't keep width and height from TileArea", () => {
			const tileLayer = new TileLayer({
				// Hack to skip having to create a map.
				width: 10, height: 10
			}, {});
			const layerObject = JSON.parse(JSON.stringify(tileLayer));
			should.not.exist(layerObject.width);
			should.not.exist(layerObject.height);
		});
	});
});
