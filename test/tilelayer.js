import { should as chaiShould } from "chai";

import { TileLayer } from "../src";

const should = chaiShould();

/** @test {TileArea} */
describe("TileArea", () => {
	/** @test {toJSON} */
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
