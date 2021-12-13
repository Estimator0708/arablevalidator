const { collect_anchor } = require("./anchor");

async function collect_terra() {
  const anchor = await collect_anchor();
  return {
    anchor,
  };
}

exports.collect_terra = collect_terra;
