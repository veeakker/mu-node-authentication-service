import { updateSudo as update } from '@lblod/mu-auth-sudo';
import { sparqlEscapeUri } from 'mu';

/**
 * @param {string} sessionUri 
 */
export async function deleteSession(sessionUri, accountUri) {
  return update(`
    PREFIX session: <http://mu.semte.ch/vocabularies/session/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX veeakker: <http://veeakker.be/vocabularies/shop/>

    DELETE {
      GRAPH ?graph {
        ${sparqlEscapeUri(sessionUri)} session:account ${sparqlEscapeUri(accountUri)}.
      }
    } WHERE {
      GRAPH ?graph {
        ?graph veeakker:graphBelongsToUser ?personUri.
        ?personUri foaf:account ${sparqlEscapeUri(accountUri)}.
      }
    }`);
}
