const SESSIONS_GRAPH = process.env.SESSIONS_GRAPH || "http://mu.semte.ch/graphs/sessions";
const ACCOUNTS_GRAPH = process.env.ACCOUNTS_GRAPH || "http://mu.semte.ch/graphs/accounts";
const HASH_STRENGTH = process.env.HASH_STRENGTH || 12;

if(typeof HASH_STRENGTH != "number") {
  throw "HASH_STRENGTH environment variable is not of type 'number'";
}

const ACCOUNT_ACTIVE_STATUS = 'http://mu.semte.ch/vocabularies/account/status/active';
const ACCOUNT_INACTIVE_STATUS = 'http://mu.semte.ch/vocabularies/account/status/inactive';

export {
  SESSIONS_GRAPH,
  ACCOUNTS_GRAPH,
  HASH_STRENGTH,
  ACCOUNT_ACTIVE_STATUS,
  ACCOUNT_INACTIVE_STATUS
};