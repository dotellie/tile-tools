import { should } from "chai";

import { TileArea, Tile } from "../src";

should();

/** @test {TileArea} */
describe("TileArea", () => {
	const areaWidth = 30, areaHeight = 30;
	let tileArea, tiles;

	beforeEach(() => {
		tiles = [];
		for (let i = 0; i < areaWidth * areaHeight; i++) {
			tiles.push(new Tile({
				tileId: parseInt(Math.random() * 100)
			}));
		}

		tileArea = new TileArea(areaWidth, areaHeight, tiles);
	});

	/** @test {TileArea#constructor} */
	describe("#constructor", () => {
		it("rejects non-tile objects", () => {
			(() => {
				// eslint-disable-next-line no-new
				new TileArea(1, 1, [{ tileId: 0 }]);
			}).should.throw(TypeError);
		});

		it("requires width and height to equal amount of tiles", () => {
			(() => {
				// eslint-disable-next-line no-new
				new TileArea(0, 0, [new Tile({ tileId: 0 })]);
			}).should.throw(RangeError);
		});
	});

	/** @test {TileArea#getTileIndex} */
	describe("#getTileIndex", () => {
		it("returns the right index", () => {
			tileArea.getTileIndex(16, 20).should.equal(616);
			tileArea.getTileIndex(5, 26).should.equal(785);
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

	/** @test {TileArea#getTile} */
	describe("#getTile", () => {
		it("returns the correct tile", () => {
			tileArea.getTile(10, 13).should.equal(tileArea.tiles[400]);
		});
		it("crashes if out of bounds", () => {
			(() => {
				tileArea.getTile(-1, 0);
			}).should.throw(RangeError);
			(() => {
				tileArea.getTile(0, areaWidth);
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

	/** @test {TileArea#getTilingTileData} */
	describe("#getTilingTileData", () => {
		it("gets the right tile forward", () => {
			const v = Math.floor(Math.random() * areaWidth);
			const vTile = tileArea.tiles[tileArea.getTileIndex(v, v)];
			tileArea.getTilingTileData(0, 0, areaWidth + v, v).should.deep.equal(vTile);
		});
		it("gets the right tile backwards", () => {
			const v = Math.floor(Math.random() * areaWidth);
			const vTile = tileArea.tiles[tileArea.getTileIndex(v, v)];
			tileArea.getTilingTileData(0, 0, v - areaWidth, v).should.deep.equal(vTile);
		});
		it("gets the right tile far backwards", () => {
			// Note: getting backwards usually causes trouble, so this is for my
			// own sanity - Ellie
			const v = Math.floor(Math.random() * areaWidth);
			const vTile = tileArea.tiles[tileArea.getTileIndex(v, v)];
			tileArea.getTilingTileData(0, 0, v - areaWidth * 100, v).should.deep.equal(vTile);
		});
	});

	/** @test {TileArea#insertTileArea} */
	describe("#insertTileArea", () => {
		const smallAreaWidth = 3, smallAreaHeight = 3;
		let smallTileArea;

		beforeEach(() => {
			const tiles = [];
			for (let i = 0; i < smallAreaWidth * smallAreaHeight; i++) {
				tiles.push(new Tile({
					tileId: parseInt(Math.random() * 100)
				}));
			}
			smallTileArea = new TileArea(smallAreaWidth, smallAreaHeight, tiles);
		});

		it("inserts a tile area correctly", () => {
			const x = parseInt((areaWidth - smallAreaWidth) / 2);
			const y = parseInt((areaHeight - smallAreaHeight) / 2);
			tileArea.insertTileArea(x, y, smallTileArea);

			tileArea.getTileArea(x, y, smallAreaWidth, smallAreaHeight)
				.should.deep.equal(smallTileArea);
		});
		it("can skip empty (-1) tiles", () => {
			tileArea.insertTileArea(
				0, 0,
				new TileArea(1, 1, [new Tile({ tileId: -1 })]),
				true
			);

			tileArea.getTileArea(0, 0, 1, 1).tiles[0].tileId.should.not.equal(-1);
		});
		it("doesn't crash when going out of bounds", () => {
			const x = -smallAreaWidth + 1;
			const y = -smallAreaHeight + 1;
			tileArea.insertTileArea(x, y, smallTileArea);

			tileArea.getTileArea(0, 0, 1, 1).tiles[0].tileId.should.equal(
				smallTileArea.tiles[smallTileArea.tiles.length - 1].tileId
			);
		});
	});

	/** @test {TileArea#resize} */
	describe("#resize", () => {
		let newWidth, newHeight;

		const shrink = () => {
			newWidth = areaWidth / 2;
			newHeight = areaHeight / 2;
			tileArea.resize(newWidth, newHeight);
		};
		const grow = () => {
			newWidth = areaWidth * 2;
			newHeight = areaHeight * 2;
			tileArea.resize(newWidth, newHeight);
		};
		const unevenResize = () => {
			newWidth = areaWidth * 2;
			newHeight = areaHeight / 2;
		};

		it("can shrink dimmensions", () => {
			shrink();
			tileArea.width.should.equal(newWidth);
			tileArea.height.should.equal(newHeight);
		});
		it("can grow dimmensions", () => {
			grow();
			tileArea.width.should.equal(newWidth);
			tileArea.height.should.equal(newHeight);
		});
		it("keeps tiles intact", () => {
			const aTileX = 5;
			const aTileY = 6;
			const aTile = tileArea.getTileArea(aTileX, aTileY, 1, 1).tiles[0];
			shrink();
			tileArea.getTileArea(aTileX, aTileY, 1, 1).tiles[0].should.equal(aTile);
			grow();
			tileArea.getTileArea(aTileX, aTileY, 1, 1).tiles[0].should.equal(aTile);
			unevenResize();
			tileArea.getTileArea(aTileX, aTileY, 1, 1).tiles[0].should.equal(aTile);
		});
		it("adds empty tiles when growing", () => {
			grow();
			tileArea.tiles[tileArea.getTileIndex(newWidth - 1, newHeight - 1)].tileId.should.equal(-1);
		});
	});

	/** @test {TileArea#fillAt} */
	describe("#fillAt", () => {
		const fillTileArea = new TileArea(2, 2, [
			new Tile("2:0"), new Tile("3:0"),
			new Tile("3:0"), new Tile("2:0")
		]);

		beforeEach(() => {
			tileArea.tiles.forEach(tile => {
				tile.setData(0, 0);
			});
			tileArea.tiles[10].setData(1, 0);
			tileArea.tiles[20].setData(0, 1);
		});

		it("fills correctly", () => {
			tileArea.fillAt(2, 2, fillTileArea);
			tileArea.tiles[0].tileId.should.equal(2);
			tileArea.tiles[2].tileId.should.equal(2);
		});
		it("tiles correctly", () => {
			tileArea.fillAt(2, 2, fillTileArea);
			tileArea.tiles[1].tileId.should.equal(3);
			tileArea.tiles[3].tileId.should.equal(3);
		});
		it("doesn't overwrite anything it shouldn't", () => {
			tileArea.fillAt(0, 0, fillTileArea);
			tileArea.tiles[10].tileId.should.not.equal(2);
		});
		it("respects tileset ID's", () => {
			tileArea.fillAt(0, 0, fillTileArea);
			tileArea.tiles[10].tileId.should.not.equal(2);
		});
		it("doesn't end up in a loop", () => {
			const otherFillTileArea = new TileArea(1, 1, [new Tile("0:0")]);
			tileArea.fillAt(0, 0, otherFillTileArea);
		});
	});
});
