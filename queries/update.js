import { updateSudo as update } from '@lblod/mu-auth-sudo';
import { sparqlEscapeUri, sparqlEscapeString } from 'mu';

export async function updatePasswordHashByAccount(accountUri, newPasswordHash) {
  try {
  return await update(`
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>  

    DELETE {
      GRAPH <http://mu.semte.ch/application> {
        ${sparqlEscapeUri(accountUri)} account:password ?passwordHash.
      }
    }
    INSERT {
      GRAPH <http://mu.semte.ch/application> {
        ${sparqlEscapeUri(accountUri)} account:password ${sparqlEscapeUri(newPasswordHash)}.
      }
    }
    WHERE {
      GRAPH <http://mu.semte.ch/application> {
        ${sparqlEscapeUri(accountUri)} account:password ?passwordHash.
      }
    }
  `)
  } catch (err){
    console.log(err)
  }
}