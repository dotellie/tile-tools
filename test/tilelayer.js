import { should } from "chai";

import { TileMap } from "../src";

should();

/** @test {TileLayer} */
describe("TileLayer", () => {
	const mapWidth = 100, mapHeight = 100;
	let tilelayer, tiles;

	beforeEach(() => {
		tiles = [];
		for (let i = 0; i < mapWidth * mapHeight; i++) {
			tiles.push({
				tileId: parseInt(Math.random() * 100)
			});
		}

		tilelayer = new TileMap({
			width: mapWidth,
			height: mapHeight,
			layers: [{ tiles }]
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

	/** @test {TileLayer#getTileArea} */
	describe("#getTileArea", () => {
		it("returns the correct tiles", () => {
			const tileArea = tilelayer.getTileArea(0, 0, 2, 2);
			for (let x = 0; x < tileArea.width; x++) {
				for (let y = 0; y < tileArea.width; y++) {
					tileArea.tiles[x + y * tileArea.width].tileId.should.equal(tiles[x + y * mapWidth].tileId);
				}
			}
		});
		it("returns the correct dimmensions", () => {
			const tileArea = tilelayer.getTileArea(0, 5, 3, 2);
			tileArea.width.should.equal(3);
			tileArea.height.should.equal(2);
		});
		it("crashes if out of bounds", () => {
			(() => {
				tilelayer.getTileArea(mapWidth, 0, 50);
			}).should.throw(RangeError);
			(() => {
				tilelayer.getTileArea(mapWidth - 2, 0, 5, 1);
			}).should.throw(RangeError);
		});
		it("crashes if rectangle is invalid", () => {
			(() => {
				tilelayer.getTileArea(0, 0, -1, 1);
			}).should.throw(RangeError);
			(() => {
				tilelayer.getTileArea(0, 0, 1, 0);
			}).should.throw(RangeError);
		});
	});
});
