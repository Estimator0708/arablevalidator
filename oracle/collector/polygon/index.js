const { collect_quickswap } = require('./quickSwap');

async function collect_polygon() {
  const polygonData = await collect_quickswap();
  return {
    polygonData,
  };
}

exports.collect_polygon = collect_polygon;
