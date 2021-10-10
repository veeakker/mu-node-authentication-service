const SESSIONS_GRAPH = process.env.SESSIONS_GRAPH || "http://mu.semte.ch/graphs/sessions";
const ACCOUNTS_GRAPH = process.env.ACCOUNTS_GRAPH || "http://mu.semte.ch/graphs/accounts";
const HASH_STRENGTH = process.env.HASH_STRENGTH || 12;

if(typeof HASH_STRENGTH != "number") {
  throw "HASH_STRENGTH environment variable is not of type 'number'";
}

export {
  SESSIONS_GRAPH,
  ACCOUNTS_GRAPH,
  HASH_STRENGTH
};