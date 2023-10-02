import { querySudo as query } from '@lblod/mu-auth-sudo';
import { sparqlEscapeString, sparqlEscapeUri } from 'mu';

/**
 * @param {string} email 
 * @returns  { number } number of accounts with this email
 */

export function selectAccountCountByEmail(email) {
  return query(`
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>
    PREFIX veeakker: <http://veeakker.be/vocabularies/shop/>

    SELECT (count(?account) as ?accountCount) WHERE {
      GRAPH ?userGraph {
        ?graph veeakker:graphBelongsToUser/foaf:account/account:email ${sparqlEscapeString(email)}.
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
    PREFIX veeakker: <http://veeakker.be/vocabularies/shop/>

    SELECT ?accountUri ?passwordHash ?status WHERE {
      GRAPH ?userGraph {
        ?userGraph veeakker:graphBelongsToUser/foaf:account ?accountUri.
        ?accountUri
          a foaf:OnlineAccount;
          account:email ${sparqlEscapeString(email)};
          account:password ?passwordHash;
          account:status ?status.
      }
    }`);
}

/**
 * @param {string} sessionUri 
 * @returns {accountId, accountUri} 
 */

export function selectAccountBySession(sessionUri) {
  return query(`
    PREFIX session: <http://mu.semte.ch/vocabularies/session/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX veeakker: <http://veeakker.be/vocabularies/shop/>

    SELECT ?accountUri ?userGraph WHERE {
      GRAPH ?userGraph {
        ?userGraph veeakker:graphBelongsToUser/foaf:account ?accountUri.
        ${sparqlEscapeUri(sessionUri)} session:account ?accountUri.
        ?accountUri a foaf:OnlineAccount .
      }
    }`);
}

/**
 * @param {string} accountUri
 * @returns {passwordhash} 
 */

export function selectPasswordhashByAccount(accountUri) {
  return query(`
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX veeakker: <http://veeakker.be/vocabularies/shop/>

    SELECT ?passwordhash WHERE {
      GRAPH ?userGraph {
        ?userGraph veeakker:graphBelongsToUser/foaf:account ${sparqlEscapeUri(accountUri)}.
        ${sparqlEscapeUri(accountUri)}
          a foaf:OnlineAccount ; 
          account:password ?passwordhash.
      }
    }
  `);
}

export function selectAccountInfo(userGraph) {
  return query(`
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX schema: <http://schema.org/>
    PREFIX veeakker: <http://veeakker.be/vocabularies/shop/>

    SELECT *
    WHERE {
      GRAPH ${sparqlEscapeUri(userGraph)} {
        ${sparqlEscapeUri(userGraph)}
           a foaf:Person;
           mu:uuid ?personUuid;
           foaf:account ?account;
           schema:postalAddress ?postalAddress;
           foaf:firstName ?firstName;
           foaf:lastName ?lastName;
           foaf:email ?email;
           foaf:phone ?phone.

        ?account
           a foaf:OnlineAccount;
           mu:uuid ?accountUuid;
           account:email ?email.

        ?postalAddress
           a schema:PostalAddress;
           mu:uuid ?postalAddressUuid;
           schema:addressCountry ?country;
           schema:addressLocality ?locality;
           schema:postalCode ?postalCode;
           schema:streetAddress ?streetAddress.
      }
    } LIMIT 1`);
}

export function countMatchingPeopleForPersonId({graph, id}) {
  return query(`
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX schema: <http://schema.org/>
    PREFIX veeakker: <http://veeakker.be/vocabularies/shop/>

    SELECT (COUNT (?person) AS ?matchingUserCount)
    WHERE {
      VALUES ?person { ${sparqlEscapeUri(graph)} }
      GRAPH ${sparqlEscapeUri(graph)} {
        ?person
           a foaf:Person;
           mu:uuid ${sparqlEscapeString(id)}.
      }
    }`);
}
