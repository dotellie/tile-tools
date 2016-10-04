import { should } from "chai";

import { Tile } from "../src";

should();

/** @test {Tile} */
describe("TileMap", () => {
	/** @test {Tile#constructor} */
	describe("#create", () => {
		it("creates from objects", () => {
			let tile = new Tile({
				tileId: 56,
				tilesetId: 1
			});
			tile.tileId.should.equal(56);
			tile.tilesetId.should.equal(1);
		});
		it("creates from strings", () => {
			let tile = new Tile("224:5");
			tile.tileId.should.equal(224);
			tile.tilesetId.should.equal(5);
		});
	});
});
