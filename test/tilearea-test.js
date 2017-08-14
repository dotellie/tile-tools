import { expect } from "chai";

import * as TileArea from "../src/index.js";

describe("tilearea", () => {
    const areaWidth = 30, areaHeight = 30;
    let area, tiles;

    beforeEach(() => {
        tiles = [];
        for (let i = 0; i < areaWidth * areaHeight; i++) {
            tiles.push({
                tileId: parseInt(Math.random() * 100)
            });
        }

        area = TileArea.createTileArea(areaWidth, areaHeight, tiles);
    });

    /** @test {createTileArea} */
    describe("createTileArea", () => {
        it("requires width and height to equal amount of tiles", () => {
            expect(() => {
                TileArea.createTileArea(0, 0, [{}]);
            }).to.throw(RangeError);

            expect(TileArea.createTileArea(1, 2, [{}, {}])).to.be.ok;
        });
    });

    /** @test {TileArea#getTileIndex} */
    describe("getTileIndex", () => {
        it("returns the right index", () => {
            expect(TileArea.getTileIndex(area, 16, 20)).to.equal(616);
            expect(TileArea.getTileIndex(area, 5, 26)).to.equal(785);
        });
        it("crashes if out of bounds", () => {
            expect(() => {
                TileArea.getTileIndex(area, areaWidth, 0);
            }).to.throw(RangeError);
            expect(() => {
                TileArea.getTileIndex(area, -1, 0);
            }).to.throw(RangeError);
        });
    });

    /** @test {getTile} */
    describe("getTile", () => {
        it("returns the correct tile", () => {
            expect(TileArea.getTile(area, 10, 13)).to.deep.equal(area.tiles[400]);
        });
        it("crashes if out of bounds", () => {
            expect(() => {
                TileArea.getTile(area, -1, 0);
            }).to.throw(RangeError);
            expect(() => {
                TileArea.getTile(area, 0, areaWidth);
            }).to.throw(RangeError);
        });
    });

    /** @test {getTileAreaSlice} */
    describe("getTileAreaSlice", () => {
        it("returns the correct tiles", () => {
            const tileAreaSlice = TileArea.getTileAreaSlice(area, 0, 0, 2, 2);
            for (let x = 0; x < tileAreaSlice.width; x++) {
                for (let y = 0; y < tileAreaSlice.width; y++) {
                    expect(tileAreaSlice.tiles[TileArea.getTileIndex(tileAreaSlice, x, y)].tileId)
                        .to.equal(tiles[x + y * areaWidth].tileId);
                }
            }
        });
        it("returns the correct dimmensions", () => {
            const tileAreaSlice = TileArea.getTileAreaSlice(area, 0, 5, 3, 2);
            expect(tileAreaSlice.width).to.equal(3);
            expect(tileAreaSlice.height).to.equal(2);
        });
        it("returns empty tiles when going out of bounds", () => {
            expect(TileArea.getTileAreaSlice(area, areaWidth, 0, 50, 10).tiles[areaWidth + 1].tileId).to.equal(-1);
            expect(TileArea.getTileAreaSlice(area, 0, -5, 2, 2).tiles[0].tileId).to.equal(-1);
        });
        it("crashes if rectangle is invalid", () => {
            expect(() => {
                TileArea.getTileAreaSlice(area, 0, 0, -1, 1);
            }).to.throw(RangeError);
            expect(() => {
                TileArea.getTileAreaSlice(area, 0, 0, 1, 0);
            }).to.throw(RangeError);
        });
    });

    /** @test {getTilingTileData} */
    describe("getTilingTileData", () => {
        it("gets the right tile forward", () => {
            const v = Math.floor(Math.random() * areaWidth);
            const vTile = area.tiles[TileArea.getTileIndex(area, v, v)];
            expect(TileArea.getTilingTileData(area, 0, 0, areaWidth + v, v)).to.deep.equal(vTile);
        });
        it("gets the right tile backwards", () => {
            const v = Math.floor(Math.random() * areaWidth);
            const vTile = area.tiles[TileArea.getTileIndex(area, v, v)];
            expect(TileArea.getTilingTileData(area, 0, 0, v - areaWidth, v)).to.deep.equal(vTile);
        });
        it("gets the right tile far backwards", () => {
            // Note: getting backwards usually causes trouble, so this is for my
            // own sanity - Ellie
            const v = Math.floor(Math.random() * areaWidth);
            const vTile = area.tiles[TileArea.getTileIndex(area, v, v)];
            expect(TileArea.getTilingTileData(area, 0, 0, v - areaWidth * 100, v)).to.deep.equal(vTile);
        });
    });

    /** @test {mergeTileAreas} */
    describe("mergeTileAreas", () => {
        const smallAreaWidth = 3, smallAreaHeight = 3;
        let smallArea;

        beforeEach(() => {
            const tiles = [];
            for (let i = 0; i < smallAreaWidth * smallAreaHeight; i++) {
                tiles.push({
                    tileId: parseInt(Math.random() * 100)
                });
            }
            smallArea = TileArea.createTileArea(smallAreaWidth, smallAreaHeight, tiles);
        });

        it("inserts a tile area correctly", () => {
            const x = parseInt((areaWidth - smallAreaWidth) / 2);
            const y = parseInt((areaHeight - smallAreaHeight) / 2);
            const newArea = TileArea.mergeTileAreas(area, smallArea, x, y);

            expect(TileArea.getTileAreaSlice(newArea, x, y, smallAreaWidth, smallAreaHeight))
                .to.deep.equal(smallArea);
        });
        it("can skip empty (-1) tiles", () => {
            const newArea = TileArea.mergeTileAreas(
                area,
                TileArea.createTileArea(1, 1, [{ tileId: -1, tilesetId: -1 }]),
                0, 0,
                true
            );

            expect(TileArea.getTileAreaSlice(newArea, 0, 0, 1, 1).tiles[0].tileId).to.not.equal(-1);
        });
        it("doesn't crash when going out of bounds", () => {
            const x = -smallAreaWidth + 1;
            const y = -smallAreaHeight + 1;
            const newArea = TileArea.mergeTileAreas(area, smallArea, x, y);

            expect(TileArea.getTileAreaSlice(newArea, 0, 0, 1, 1).tiles[0].tileId).to.deep.equal(
                smallArea.tiles[smallArea.tiles.length - 1].tileId
            );
        });
        it("throws errors like normal", () => {
            expect(() => {
                TileArea.mergeTileAreas(area, { width: 1, height: 1 }, 0, 0);
            }).to.throw();
        });
    });

    /** @test {fillTileAreaAt} */
    describe("fillTileAreaAt", () => {
        const fillTileArea = TileArea.createTileArea(2, 2, [
            { tileId: 2, tilesetId: 0 }, { tileId: 3, tilesetId: 0 },
            { tileId: 3, tilesetId: 0 }, { tileId: 2, tilesetId: 0 }
        ]);

        beforeEach(() => {
            area.tiles.forEach(tile => {
                tile.tileId = 0;
                tile.tilesetId = 0;
            });
            area.tiles[10] = { tileId: 1, tilesetId: 0 };
            area.tiles[20] = { tileId: 0, tilesetId: 1 };
        });

        it("fills correctly", () => {
            const newArea = TileArea.fillTileAreaAt(area, 2, 2, fillTileArea);
            expect(newArea.tiles[0].tileId).to.equal(2);
            expect(newArea.tiles[2].tileId).to.equal(2);
        });
        it("tiles correctly", () => {
            const newArea = TileArea.fillTileAreaAt(area, 2, 2, fillTileArea);
            expect(newArea.tiles[1].tileId).to.equal(3);
            expect(newArea.tiles[3].tileId).to.equal(3);
        });
        it("doesn't overwrite anything it shouldn't", () => {
            const newArea = TileArea.fillTileAreaAt(area, 0, 0, fillTileArea);
            expect(newArea.tiles[10].tileId).to.not.equal(2);
        });
        it("respects tileset ID's", () => {
            const newArea = TileArea.fillTileAreaAt(area, 0, 0, fillTileArea);
            expect(newArea.tiles[20].tileId).to.equal(0);
        });
        it("doesn't end up in a loop", () => {
            const otherFillTileArea = TileArea.createTileArea(1, 1, [{ tileId: 0, tilesetId: 0 }]);
            TileArea.fillTileAreaAt(area, 0, 0, otherFillTileArea);
        });
    });
});
