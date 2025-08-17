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

export function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d * 1000;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
