import { updateSudo as update } from '@lblod/mu-auth-sudo';
import { sparqlEscapeUri, sparqlEscapeString, sparqlEscapeDateTime } from 'mu';

export function updatePasswordHashByAccount(accountUri, newPasswordHash) {
  return update(`
    PREFIX veeakker: <http://veeakker.be/vocabularies/shop/>
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>  
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    DELETE {
      GRAPH ?accountGraph {
        ${sparqlEscapeUri(accountUri)} account:password ?passwordHash.
      }
    }
    INSERT {
      GRAPH ?accountGraph {
        ${sparqlEscapeUri(accountUri)} account:password ${sparqlEscapeString(newPasswordHash)}.
      }
    }
    WHERE {
      GRAPH ?accountGraph {
        ?accountGraph veeakker:graphBelongsToUser/foaf:account ${sparqlEscapeUri(accountUri)}.
        ${sparqlEscapeUri(accountUri)} account:password ?passwordHash.
      }
    }
  `);
}

export function updateAccountStatus(accountUri, statusUri) {
  const now = new Date().toISOString();
  return update(`
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>
    PREFIX veeakker: <http://veeakker.be/vocabularies/shop/>
 
    DELETE {
      GRAPH ?accountGraph {
        ${sparqlEscapeUri(accountUri)}
          account:status ?status;
          dc:modified ?modified.
      }
    }
    INSERT {
      GRAPH ?accountGraph {
        ${sparqlEscapeUri(accountUri)}
          account:status ${sparqlEscapeUri(statusUri)};
          dc:modified ${sparqlEscapeDateTime(now)}.
      }
    }
    WHERE {
      GRAPH ?accountGraph {
        ?accountGraph veeakker:graphBelongsToUser/foaf:account ${sparqlEscapeUri(accountUri)}.
        ${sparqlEscapeUri(accountUri)}
          account:status ?status;
          dc:modified ?modified.
      }
    }
  `);
}

export async function updatePerson( graph, {id, email, phone, firstName, lastName }) {
  return update(`
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX schema: <http://schema.org/>
    PREFIX veeakker: <http://veeakker.be/vocabularies/shop/>

    DELETE {
      GRAPH ${sparqlEscapeUri(graph)} {
        ${sparqlEscapeUri(graph)}
           foaf:firstName ?firstName;
           foaf:lastName ?lastName;
           foaf:email ?email;
           foaf:phone ?phone.
      }
    } INSERT {
      GRAPH ${sparqlEscapeUri(graph)} {
        ${sparqlEscapeUri(graph)}
           foaf:firstName ${sparqlEscapeString(firstName)};
           foaf:lastName ${sparqlEscapeString(lastName)};
           foaf:email ${sparqlEscapeString(email)};
           foaf:phone ${sparqlEscapeString(phone)}.
      }
    } WHERE {
      GRAPH ${sparqlEscapeUri(graph)} {
        ${sparqlEscapeUri(graph)}
           a foaf:Person;
           mu:uuid ${sparqlEscapeString(id)};
           schema:postalAddress ?postalAddress;
           foaf:firstName ?firstName;
           foaf:lastName ?lastName;
           foaf:email ?email;
           foaf:phone ?phone.
      }
    }`);
}

export async function updatePostalAddress( graph, { id, country, locality, postalCode, streetAddress }) {
  return update(`
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX account: <http://mu.semte.ch/vocabularies/account/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX schema: <http://schema.org/>
    PREFIX veeakker: <http://veeakker.be/vocabularies/shop/>

    DELETE {
      GRAPH ${sparqlEscapeUri(graph)} {
        ?postalAddress
           schema:addressCountry ?country;
           schema:addressLocality ?locality;
           schema:postalCode ?postalCode;
           schema:streetAddress ?streetAddress.
      }
    } INSERT {
      GRAPH ${sparqlEscapeUri(graph)} {
        ?postalAddress
           schema:addressCountry ${sparqlEscapeString(country)};
           schema:addressLocality ${sparqlEscapeString(locality)};
           schema:postalCode ${sparqlEscapeString(postalCode)};
           schema:streetAddress ${sparqlEscapeString(streetAddress)}.
      }
    } WHERE {
      GRAPH ${sparqlEscapeUri(graph)} {
        ?postalAddress
           a schema:PostalAddress;
           mu:uuid ${sparqlEscapeString(id)};
           schema:addressCountry ?country;
           schema:addressLocality ?locality;
           schema:postalCode ?postalCode;
           schema:streetAddress ?streetAddress.
      }
    }`);
}
