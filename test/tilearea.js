import { should } from "chai";

import { TileArea } from "../src";

should();

/** @test {TileArea} */
describe("TileArea", () => {
	const areaWidth = 100, areaHeight = 100;
	let tileArea, tiles;

	beforeEach(() => {
		tiles = [];
		for (let i = 0; i < areaWidth * areaHeight; i++) {
			tiles.push({
				tileId: parseInt(Math.random() * 100)
			});
		}

		tileArea = new TileArea(areaWidth, areaHeight, tiles);
	});

	/** @test {TileArea#getTileIndex} */
	describe("#getTileIndex", () => {
		it("returns the right index", () => {
			tileArea.getTileIndex(16, 56).should.equal(5616);
			tileArea.getTileIndex(76, 32).should.equal(3276);
		});
		it("crashes if out of bounds", () => {
			(() => {
				tileArea.getTileIndex(areaWidth, 0);
			}).should.throw(RangeError);
			(() => {
				tileArea.getTileIndex(-1, 0);
			}).should.throw(RangeError);
		});
	});

	/** @test {TileArea#getTileArea} */
	describe("#getTileArea", () => {
		it("returns the correct tiles", () => {
			const tileAreaSplice = tileArea.getTileArea(0, 0, 2, 2);
			for (let x = 0; x < tileAreaSplice.width; x++) {
				for (let y = 0; y < tileAreaSplice.width; y++) {
					tileAreaSplice.tiles[tileAreaSplice.getTileIndex(x, y)]
						.tileId.should.equal(tiles[x + y * areaWidth].tileId);
				}
			}
		});
		it("returns the correct dimmensions", () => {
			const tileAreaSplice = tileArea.getTileArea(0, 5, 3, 2);
			tileAreaSplice.width.should.equal(3);
			tileAreaSplice.height.should.equal(2);
		});
		it("crashes if out of bounds", () => {
			(() => {
				tileArea.getTileArea(areaWidth, 0, 50);
			}).should.throw(RangeError);
			(() => {
				tileArea.getTileArea(areaWidth - 2, 0, 5, 1);
			}).should.throw(RangeError);
		});
		it("crashes if rectangle is invalid", () => {
			(() => {
				tileArea.getTileArea(0, 0, -1, 1);
			}).should.throw(RangeError);
			(() => {
				tileArea.getTileArea(0, 0, 1, 0);
			}).should.throw(RangeError);
		});
	});
});
