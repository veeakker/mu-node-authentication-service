import { updateSudo as update } from '@lblod/mu-auth-sudo';
import { sparqlEscapeString, sparqlEscapeDateTime, sparqlEscapeUri } from 'mu';
import { ACCOUNT_ACTIVE_STATUS } from '../config';

export function createAccount(passwordHash, personId, accountId, email, firstName, lastName, streetAddress, locality, postal, phone, postalAddressId) {
  const now = new Date().toISOString();
  const accountUri = `http://veeakker.be/accounts/${accountId}`;
  const personUri = `http://veeakker.be/people/${personId}`;
  const postalAddressUri = `http://veeakker.be/postal-addresses/${postalAddressId}`;

  return update(`
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX schema: <http://schema.org/>
    PREFIX veeakker: <http://veeakker.be/vocabularies/shop/>

    INSERT DATA {
      GRAPH ${sparqlEscapeUri(personUri)} {
        ${sparqlEscapeUri(personUri)} veeakker:graphBelongsToUser ${sparqlEscapeUri(personUri)}.

        ${sparqlEscapeUri(personUri)}
           a foaf:Person;
           mu:uuid ${sparqlEscapeString(personId)};  
           dc:created ${sparqlEscapeDateTime(now)};
           dc:modified ${sparqlEscapeDateTime(now)};
           foaf:account ${sparqlEscapeUri(accountUri)};
           schema:postalAddress ${sparqlEscapeUri(postalAddressUri)};
           foaf:firstName ${sparqlEscapeString(firstName)};
           foaf:lastName ${sparqlEscapeString(lastName)};
           foaf:lastName ${sparqlEscapeString(lastName)};
           foaf:email ${sparqlEscapeString(email)};
           foaf:phone ${sparqlEscapeString(phone)}.

        ${sparqlEscapeUri(accountUri)}
           a foaf:OnlineAccount;
           mu:uuid ${sparqlEscapeString(accountId)};  
           account:email ${sparqlEscapeString(email)};  
           account:password ${sparqlEscapeString(passwordHash)};
           account:status ${sparqlEscapeUri(ACCOUNT_ACTIVE_STATUS)};
           dc:created ${sparqlEscapeDateTime(now)};
           dc:modified ${sparqlEscapeDateTime(now)}.

        ${sparqlEscapeUri(postalAddressUri)}
           a schema:PostalAddress;
           mu:uuid ${sparqlEscapeString(postalAddressId)};
           schema:addressCountry "Belgium";
           schema:addressLocality ${sparqlEscapeString(locality)};
           schema:postalCode ${sparqlEscapeString(postal)};
           schema:streetAddress ${sparqlEscapeString(streetAddress)}.
      }
    }`);
}

export function createSession(accountUri, sessionUri) {
  return update(`
    PREFIX session: <http://mu.semte.ch/vocabularies/session/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX veeakker: <http://veeakker.be/vocabularies/shop/>

    INSERT {
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
