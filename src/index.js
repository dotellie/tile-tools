/**
 * Creates a vanilla JavaScript object which represents a tile area.
 *
 * @param {number} width - The width of the created tile area.
 * @param {number} height - The height of the created tile area.
 * @param {[]} tiles - The tiles of the tile area in a 1d array.
 *
 * @returns {Object} - The created tile area object.
 * @property {number} width - The width of the created tile area.
 * @property {number} height - The height of the created tile area.
 * @property {[]} tiles - The tiles of the created tile area.
 */
export function createTileArea(width, height, tiles) {
    if (width * height !== tiles.length) {
        throw new RangeError("The width and height doesn't match the amount of tiles given.");
    }

    return {
        width, height, tiles
    };
}

/**
 * Gets the index of a tile in the tile array from a position.
 *
 * @param {Object} area - The tile area to execute the operation on.
 * @param {number} x - The x coordinate of the tile.
 * @param {number} y - The y coordinate of the tile.
 *
 * @returns {number} The index of the tile in the main array.
 */
export function getTileIndex(area, x, y) {
    if (!inRange(area, x, y)) throw new RangeError();

    return y * area.width + x;
}

/**
 * Gets the tile at a position.
 *
 * @param {Object} area - The tile area to execute the operation on.
 * @param {number} x - The x coordinate of the tile.
 * @param {number} y - The y coordinate of the tile.
 *
 * @returns {Object} The tile at the provided position.
 */
export function getTile(area, x, y) {
    return { ...area.tiles[getTileIndex(area, x, y)] };
}

/**
 * Gets a spliced area from a tile area.
 *
 * If the requested area is outside the tile area, empty tiles will be generated.
 *
 * @param {Object} area - The tile area to execute the operation on.
 * @param {number} x - The x coordinate of the tile area.
 * @param {number} y - The y coordinate of the tile area.
 * @param {number} width - The width of the tile area.
 * @param {number} height - The height of the tile area.
 *
 * @returns {Object} - The tile area requested as a plain object.
 * @property {number} width - The width of the requested tile area.
 * @property {number} height - The height of the requested tile area.
 * @property {[]} tiles - The tiles of the requested tile area.
 */
export function getTileAreaSlice(area, x, y, width, height) {
    if (width <= 0 || height <= 0) throw new RangeError();

    const tiles = [];
    for (let ly = y; ly < y + height; ly++) {
        for (let lx = x; lx < x + width; lx++) {
            if (!inRange(area, x, y, width, height)) tiles.push(emptyTile());
            else tiles.push(getTile(area, lx, ly));
        }
    }
    return createTileArea(width, height, tiles);
}

/**
 * Gets tiling data from a tile area.
 *
 * Most of the time when mapping tilemaps, having the pen be "tiling" is more
 * useful than having it overwrite everywhere. This function provides
 * that kind of functionallity.
 *
 * @param {Object} area - The tile area to execute the operation on.
 * @param {number} originX - The x coordinate to tile from.
 * @param {number} originY - The y coordinate to tile from.
 * @param {number} x - The x coordinate to get data from.
 * @param {number} y - The y coordinate to get data from.
 *
 * @returns {Object} The calculated tile.
 */
export function getTilingTileData(area, originX, originY, x, y) {
    const { width, height } = area;
    const tileX = ((x - originX) % width + width) % width;
    const tileY = ((y - originY) % height + height) % height;

    return { ...getTile(area, tileX, tileY) };
}

/**
 * Merges two tile areas together, putting the second one on top of the first one.
 *
 * The merge does not fail if it goes outside of the tile area.
 *
 * @param {Object} area - The tile area to use as the base.
 * @param {Object} area - The tile area to put on top of the first tile area.
 * @param {number} x - The x coordinate of where to put the second area relative to the first area.
 * @param {number} y - The y coordinate of where to put the second area relative to the first area.
 * @param {boolean} skipEmpty - If the insertion should skip empty (-1) tiles.
 */
export function mergeTileAreas(area1, area2, x, y, skipEmpty) {
    const newTiles = [...area1.tiles];

    for (let lx = x; lx < x + area2.width; lx++) {
        for (let ly = y; ly < y + area2.height; ly++) {
            try {
                const newTile = getTile(area2, lx - x, ly - y);
                if (skipEmpty && newTile.tileId === -1) continue;

                const index = getTileIndex(area1, lx, ly);
                newTiles[index] = { ...newTile };
            } catch (e) {
                if (e instanceof RangeError) continue;
                else throw e;
            }
        }
    }

    return createTileArea(area1.width, area1.height, newTiles);
}

/**
 * Fills an area (think bucket tool in an image manipulation program).
 *
 * @param {Object} area - The tile area to execute the operation on.
 * @param {number} x - The x coordinate of where to fill from.
 * @param {number} y - The y coordinate of where to fill from.
 * @param {Object} tileArea - The tile area to use for the fill.
 */
export function fillTileAreaAt(area, x, y, fillArea) {
    let positions = [];

    const fillTile = { ...getTile(area, x, y) };
    const seeds = [{ x, y }];

    const equal = (tile1, tile2) =>
        tile1.tileId === tile2.tileId &&
        tile1.tilesetId === tile2.tilesetId;

    const testSeed = (x, y, verticalModifier) => {
        const newY = y + verticalModifier;
        if (newY >= 0 && newY < area.height &&
            equal(getTile(area, x, newY), fillTile)) {
            if (x <= 0 ||
                !equal(getTile(area, x - 1, newY), fillTile) ||
                !equal(getTile(area, x - 1, y), fillTile)) {
                seeds.push({ x, y: newY });
            }
        }
    };

    const appliedPositions = new Set();
    const positionToIndex = pos => pos.y * area.width + pos.x;

    const newTiles = [...area.tiles];

    do {
        const seed = seeds[0];
        let { x: lx, y: ly } = seed;

        if (appliedPositions.has(positionToIndex(seed))) {
            seeds.splice(0, 1);
            continue;
        };

        do {
            positions.push({ x: lx, y: ly });
            testSeed(lx, ly, 1);
            testSeed(lx, ly, -1);
            lx++;
        } while (lx < area.width && equal(getTile(area, lx, ly), fillTile));

        lx = seed.x;
        ly = seed.y;
        while (lx > 0 && equal(getTile(area, lx - 1, ly), fillTile)) {
            lx--;
            positions.push({ x: lx, y: ly });
            testSeed(lx, ly, 1);
            testSeed(lx, ly, -1);
        }

        seeds.splice(0, 1);
        positions.forEach(position => {
            appliedPositions.add(positionToIndex(position));

            const newTile = getTilingTileData(
                fillArea, x, y, position.x, position.y
            );
            const index = getTileIndex(area, position.x, position.y);
            newTiles[index] = { ...newTile };
        });
        positions = [];
    } while (seeds.length > 0);

    return createTileArea(area.width, area.height, newTiles);
}

function inRange(area, x, y, width = 1, height = 1) {
    return !(x < 0 || x >= area.width ||
        y < 0 || y > area.height ||
        width <= 0 || x + width > area.width ||
        height <= 0 || y + height > area.height
    );
}

function emptyTile() {
    return {
        tileId: -1, tilesetId: -1
    };
}
