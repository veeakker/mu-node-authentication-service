import { updateSudo as update } from '@lblod/mu-auth-sudo';
import { sparqlEscapeUri } from 'mu';

/**
 * @param {string} sessionUri 
 */
export async function deleteSession(sessionUri, accountUri) {
  try {
  await update(`
    PREFIX session: <http://mu.semte.ch/vocabularies/session/>

    DELETE {
      GRAPH <http://mu.semte.ch/application> {
        ${sparqlEscapeUri(sessionUri)} session:account ${sparqlEscapeUri(accountUri)}.
      }
    }
    WHERE {
      GRAPH <http://mu.semte.ch/application> {
        ${sparqlEscapeUri(sessionUri)} session:account ${sparqlEscapeUri(accountUri)}.
      }
    }
  `)
  } catch (err){
    console.log(err)
  }
}

/**
 * @param {string} sessionUri 
 */
 export async function deleteAccount(accountUri) {
    const result = await update(`
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>

      DELETE {
        GRAPH <http://mu.semte.ch/application> {
        ?accountUri a foaf:onlineAccount;
        ?p ?o.
        }
      }
      WHERE {
        GRAPH <http://mu.semte.ch/application> { 
          ?accountUri a foaf:onlineAccount;
          ?p ?o.
          BIND(${sparqlEscapeUri(accountUri)} AS ?accountUri) .
        }
      }
    `)
    console.log(result)
    return result
}
