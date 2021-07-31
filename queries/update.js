import { updateSudo as update } from '@lblod/mu-auth-sudo';
import { sparqlEscapeUri, sparqlEscapeString } from 'mu';
import { SESSIONS_GRAPH, ACCOUNTS_GRAPH } from '../config';

export async function updatePasswordHashByAccount(accountUri, newPasswordHash) {
  try {
  return await update(`
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>  

    DELETE {
      GRAPH <${ACCOUNTS_GRAPH}> {
        ${sparqlEscapeUri(accountUri)} account:password ?passwordHash.
      }
    }
    INSERT {
      GRAPH <${ACCOUNTS_GRAPH}> {
        ${sparqlEscapeUri(accountUri)} account:password ${sparqlEscapeUri(newPasswordHash)}.
      }
    }
    WHERE {
      GRAPH <${ACCOUNTS_GRAPH}> {
        ${sparqlEscapeUri(accountUri)} account:password ?passwordHash.
      }
    }
  `)
  } catch (err){
    console.log(err)
  }
}