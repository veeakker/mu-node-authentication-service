import { updateSudo as update } from '@lblod/mu-auth-sudo';
import { sparqlEscapeUri } from 'mu';

/**
 * @param {string} sessionUri 
 */
export async function deleteSession(sessionUri) {
  update(`
    PREFIX session: <http://mu.semte.ch/vocabularies/session/>

    DELETE DATA {
      GRAPH <http://mu.semte.ch/application> {
      ${sparqlEscapeUri(sessionUri)} session:account ?account ;
      }
    }
  }
  `)
}