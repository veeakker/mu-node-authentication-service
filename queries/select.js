import { querySudo as query } from '@lblod/mu-auth-sudo';
import { sparqlEscapeString, sparqlEscapeUri } from 'mu';
import { SESSIONS_GRAPH, ACCOUNTS_GRAPH } from '../config';

/**
 * @param {string} email 
 * @returns  { number } number of accounts with this email
 */

export function selectAccountCountByEmail(email) {
  return query(`
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>

    SELECT (count(?account) as ?accountCount) WHERE {
      GRAPH <${ACCOUNTS_GRAPH}> {
        ?account account:email ${sparqlEscapeString(email)}
      }
    }
  `);
}

/**
 * @param {string} email 
 * @returns {accountUri, passwordHash} 
 */

export function selectAccountByEmail(email) {
  return query(`
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>

    SELECT ?accountUri ?passwordHash WHERE {
      GRAPH <${ACCOUNTS_GRAPH}> {
        ?accountUri a foaf:OnlineAccount;
                account:email ${sparqlEscapeString(email)};
                account:password ?passwordHash.
      }
    }
  `);
}

/**
 * @param {string} sessionUri 
 * @returns {accountId, accountUri} 
 */

export function selectAccountBySession(sessionUri) {
  return query(`
    PREFIX session: <http://mu.semte.ch/vocabularies/session/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT ?accountUri WHERE {
      GRAPH <${SESSIONS_GRAPH}> {
        ${sparqlEscapeUri(sessionUri)} session:account ?accountUri .
      }
      GRAPH <${ACCOUNTS_GRAPH}> {
        ?accountUri a foaf:OnlineAccount .
      }
    }
  `);
}

/**
 * @param {string} accountUri
 * @returns {passwordhash} 
 */

export function selectPasswordhashByAccount(accountUri) {
  return query(`
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT ?passwordhash WHERE {
      GRAPH <${ACCOUNTS_GRAPH}> {
        ${sparqlEscapeUri(accountUri)} a foaf:OnlineAccount ; 
                                        account:password ?passwordhash . 
      }
    }
  `);
}