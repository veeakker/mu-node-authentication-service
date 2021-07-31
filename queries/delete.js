import { updateSudo as update } from '@lblod/mu-auth-sudo';
import { sparqlEscapeUri } from 'mu';
import { SESSIONS_GRAPH, ACCOUNTS_GRAPH } from '../config';

/**
 * @param {string} sessionUri 
 */
export async function deleteSession(sessionUri, accountUri) {
  return update(`
    PREFIX session: <http://mu.semte.ch/vocabularies/session/>

    DELETE {
      GRAPH <${SESSIONS_GRAPH}> {
        ${sparqlEscapeUri(sessionUri)} session:account ${sparqlEscapeUri(accountUri)}.
      }
    }
    WHERE {
      GRAPH <${SESSIONS_GRAPH}> {
        ${sparqlEscapeUri(sessionUri)} session:account ${sparqlEscapeUri(accountUri)}.
      }
    }
  `);
}

/**
 * @param {string} sessionUri 
 */
export async function deleteAccount(accountUri) {
    const result = await update(`
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>

      DELETE {
        GRAPH <${ACCOUNTS_GRAPH}> {
        ?accountUri a foaf:onlineAccount;
        ?p ?o.
        }
      }
      WHERE {
        GRAPH <${ACCOUNTS_GRAPH}> { 
          ?accountUri a foaf:onlineAccount;
          ?p ?o.
          BIND(${sparqlEscapeUri(accountUri)} AS ?accountUri) .
        }
      }
    `);
    return result;
}
