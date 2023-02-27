const HASH_STRENGTH = process.env.HASH_STRENGTH || 12;

if(typeof HASH_STRENGTH != "number") {
  throw "HASH_STRENGTH environment variable is not of type 'number'";
}

const ACCOUNT_ACTIVE_STATUS = 'http://mu.semte.ch/vocabularies/account/status/active';
const ACCOUNT_INACTIVE_STATUS = 'http://mu.semte.ch/vocabularies/account/status/inactive';

export {
  HASH_STRENGTH,
  ACCOUNT_ACTIVE_STATUS,
  ACCOUNT_INACTIVE_STATUS
};
