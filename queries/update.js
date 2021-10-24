import { updateSudo as update } from '@lblod/mu-auth-sudo';
import { sparqlEscapeUri, sparqlEscapeString, sparqlEscapeDateTime } from 'mu';
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

export function updateAccountStatus(accountUri, statusUri) {
  const now = new Date().toISOString();
  return update(`
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>
 
    DELETE {
      GRAPH <${ACCOUNTS_GRAPH}> {
      ${sparqlEscapeUri(accountUri)} account:status ?status;
                                    dc:modified ?modified.
      }
    }
    INSERT {
      GRAPH <${ACCOUNTS_GRAPH}> {
        ${sparqlEscapeUri(accountUri)} account:status ${sparqlEscapeUri(statusUri)};
                                      dc:modified ${sparqlEscapeDateTime(now)}.
      }
    }
    WHERE {
      GRAPH <${ACCOUNTS_GRAPH}> { 
        ${sparqlEscapeUri(accountUri)} account:status ?status;
                                      dc:modified ?modified.
      }
    }
  `);
}
