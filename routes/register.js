import bcrypt from 'bcrypt';
import { uuid } from 'mu';
import { selectAccountCountByEmail } from "../queries/select";
import { createAccount } from "../queries/create";
import { HASH_STRENGTH } from '../config';
import parseResults from '../utils/parse-results';

const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export default async function register(req, res){
  const { data: { attributes: {
    email, password, "first-name": firstName, "last-name": lastName, "street-address": streetAddress, locality, postal, phone
  } } } = req.body;

  /**
   * REQUEST VALIDATION  -> HasEmail, IsValidEmail, HasPassword
   */

  let errors = [];

  if (!email)
    errors.push({
      "status": "400", "title": "Email addres is vereist om in te kunnen loggen."
    });
  if (!firstName)
    errors.push({
      "status": "400", "title": "Voornaam moet ingegeven zijn voor latere communicatie."
    });
  if (!lastName)
    errors.push({
      "status": "400", "title": "Achternaam moet ingegeven zijn voor latere communicatie."
    });
  if (!streetAddress)
    errors.push({
      "status": "400", "title": "Straat moet ingegeven zijn voor communicatie en levering."
    });
  if (!locality)
    errors.push({
      "status": "400", "title": "Gemeente moet ingegeven zijn voor communicatie en levering."
    });
  if (!postal)
    errors.push({
      "status": "400", "title": "Postcode moet ingegeven zijn voor communicatie en levering."
    });
  if (!phone)
    errors.push({
      "status": "400", "title": "Telefoonnummer moet ingegeven zijn zodat we kunnen helpen bij afhaalproblemen."
    });
  if (!validEmail.test(email))
    errors.push({
      "status": "400", "title": "Email address moet bestaan."
    });
  if(!password)
    errors.push({
      "status": "400", "title": "Wachtwoord is vereist om te kunnen inloggen."
    });

  if( errors.length ) {
    res.status(400).json({errors});
  } else {
    // Check if other accounts with this email exist in db
    const result = await selectAccountCountByEmail(email);
    const { accountCount } = parseResults(result);

    if (parseInt(accountCount) != 0) {
      return res.status(400).json({
        "errors": [
          {
            "status": "400",
            "title": "An account with this email already exists"
          }
        ]
      });
    }

    //Create the new account
    const personId = uuid();
    const accountId = uuid();
    const passwordHash = await bcrypt.hash(password, HASH_STRENGTH);
    const postalAddressId = uuid();

    await createAccount(
      passwordHash, personId, accountId, email, firstName, lastName, streetAddress, locality, postal, phone, postalAddressId
    );

    return res.status(201).json({
      links: {
        self: req.headers['x-rewrite-url'] + '/' + accountId
      },
      data: {
        type: 'accounts',
        id: accountId,
        attributes: {
          email: email,
        },
        relationships: {
          "postal-address": {
            data: {
              "type": "postal-addresses",
              "id": postalAddressId
            }
          }
        }
      },
      included: [
        {
          type: "postal-addresses",
          id: postalAddressId,
          attributes: {
            country: "Belgium",
            locality,
            "postal-code": postal,
            "street-address": streetAddress
          }
        }
      ]
    });
  }
}
