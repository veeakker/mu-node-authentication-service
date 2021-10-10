import { updateSudo as update } from '@lblod/mu-auth-sudo';
import { sparqlEscapeUri, sparqlEscapeString } from 'mu';
import { ACCOUNTS_GRAPH } from '../config';

export function updatePasswordHashByAccount(accountUri, newPasswordHash) {
  return update(`
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>  

    DELETE {
      GRAPH <${ACCOUNTS_GRAPH}> {
        ${sparqlEscapeUri(accountUri)} account:password ?passwordHash.
      }
    }
    INSERT {
      GRAPH <${ACCOUNTS_GRAPH}> {
        ${sparqlEscapeUri(accountUri)} account:password ${sparqlEscapeString(newPasswordHash)}.
      }
    }
    WHERE {
      GRAPH <${ACCOUNTS_GRAPH}> {
        ${sparqlEscapeUri(accountUri)} account:password ?passwordHash.
      }
    }
  `);
}