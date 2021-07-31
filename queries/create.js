import { updateSudo as update } from '@lblod/mu-auth-sudo';
import { sparqlEscapeString, sparqlEscapeDateTime, sparqlEscapeUri } from 'mu';
import parseResults from '../utils/parse-results';
import { SESSIONS_GRAPH, ACCOUNTS_GRAPH } from '../config';

export async function createAccount(email, passwordHash, personId, accountId) {
  const now = new Date().toISOString();
  const accountUri = `http://xmlns.com/foaf/0.1/OnlineAccount/${accountId}`;
  const personUri = `http://xmlns.com/foaf/0.1/person/${personId}`;

  const result = await update(`

  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  PREFIX account: <http://mu.semte.ch/vocabularies/account/>
  PREFIX mu: <http://mu.semte.ch/vocabularies/core/>

  INSERT DATA {
    GRAPH <${ACCOUNTS_GRAPH}> {
      ${sparqlEscapeUri(personUri)} a foaf:Person;
                                mu:uuid ${sparqlEscapeString(personId)};  
                                dc:created ${sparqlEscapeDateTime(now)};
                                dc:modified ${sparqlEscapeDateTime(now)};
                                foaf:account ${sparqlEscapeUri(accountUri)}.

      ${sparqlEscapeUri(accountUri)} a foaf:OnlineAccount;
                                mu:uuid ${sparqlEscapeString(accountId)};  
                                account:email ${sparqlEscapeString(email)};  
                                account:password ${sparqlEscapeString(passwordHash)};
                                dc:created ${sparqlEscapeDateTime(now)};
                                dc:modified ${sparqlEscapeDateTime(now)}.
    }
  }
  `)
  return parseResults(result)
}

export async function createSession(account_uri, session_uri) {
  const session_id = session_uri.split('/').pop();

  const result = await update(`
    PREFIX session: <http://mu.semte.ch/vocabularies/session/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>

    INSERT DATA {
      GRAPH <${SESSIONS_GRAPH}> {
        ${sparqlEscapeUri(session_uri)} session:account ${sparqlEscapeUri(account_uri)};
              mu:uuid ${sparqlEscapeString(session_id)}.
      }
    }
  `)

  return parseResults(result)
}
