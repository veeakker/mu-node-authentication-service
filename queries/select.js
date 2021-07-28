import { querySudo as query } from '@lblod/mu-auth-sudo';
import { sparqlEscapeString, sparqlEscapeUri, uuid } from 'mu';
import parseResults from '../utils/parse-results';

/**
 * @param {string} email 
 * @returns  { number } number of accounts with this email
 */

export async function selectAccountCountByEmail(email) {
  const result = await query(`
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>

    SELECT (count(?account) as ?accountCount) WHERE {
      GRAPH <http://mu.semte.ch/application> {
        ?account account:email ${sparqlEscapeString(email)}
      }
    }
  `)

  return parseResults(result)
}

/**
 * @param {string} email 
 * @returns {accountUri, passwordHash} 
 */

export async function selectAccountByEmail(email) {
  const result = await query(`
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>

    SELECT ?accountUri ?passwordHash WHERE {
      GRAPH <http://mu.semte.ch/application> {
        ?accountUri a foaf:OnlineAccount;
                account:email ${sparqlEscapeString(email)};
                account:password ?passwordHash.
      }
    }
  `)
  
  return parseResults(result)
}

/**
 * @param {string} sessionUri 
 * @returns {accountId, accountUri} 
 */

export async function selectAccountBySession(sessionUri) {
  const result = await query(`
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX session: <http://mu.semte.ch/vocabularies/session/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT ?accountUri WHERE {
      GRAPH <http://mu.semte.ch/application> {
        ${sparqlEscapeUri(sessionUri)} session:account ?accountUri .
      }
      GRAPH <http://mu.semte.ch/application> {
        ?accountUri a foaf:OnlineAccount .
      }
    }
  `)

  return parseResults(result)
}

export async function selectPasswordhashByAccount(accountUri) {
  const result = await query(`
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT ?passwordhash WHERE {
      GRAPH <http://mu.semte.ch/application> {
        ${sparqlEscapeUri(accountUri)} a foaf:OnlineAccount ; 
        account:password ?passwordhash . 
      }
    }
  `)

  return parseResults(result)
}