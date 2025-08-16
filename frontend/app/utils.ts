const TILE_SIZE = 1000;
const ws = (2 * Math.PI * 6378137) / 2;

function resolution(l: number) {
  return (2 * ws) / TILE_SIZE / 2 ** l;
}

function metersToPixels(l: number, _: number, T: number) {
  const z = resolution(T),
    F = (l + ws) / z,
    C = (ws - _) / z;
  return [F, C];
}

function pixelsToTile(l: number, _: number) {
  const T = Math.ceil(l / TILE_SIZE) - 1,
    z = Math.ceil(_ / TILE_SIZE) - 1;
  return [T, z];
}

function metersToTile(l: number, _: number, T: number) {
  const [z, F] = metersToPixels(l, _, T);
  return pixelsToTile(z, F);
}
function latLonToMeters(l: number, _: number) {
  const T = (_ / 180) * ws,
    z = ((Math.log(Math.tan(((90 + l) * Math.PI) / 360)) / (Math.PI / 180)) * ws) / 180;
  return [T, z];
}

export function latLonToTilePixel(lat: number, lon: number) {
  const [z, F] = latLonToMeters(lat, lon);
  const [C, o] = metersToTile(z, F, 11);
  const [W, G] = metersToPixels(z, F, 11);

  return {
    tile: [C, o],
    pixel: [Math.floor(W) % TILE_SIZE, Math.floor(G) % TILE_SIZE],
  };
}
