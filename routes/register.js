import bcrypt from 'bcrypt';
import { uuid } from 'mu';
import { selectAccountCountByEmail } from "../queries/select";
import { createAccount } from "../queries/create";
import { HASH_STRENGTH } from '../config';
import parseResults from '../utils/parse-results';

const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export default async function register(req, res){
  const { data: { attributes: { email, password } } } = req.body;

  /**
   * REQUEST VALIDATION  -> HasEmail, IsValidEmail, HasPassword
   */

  if (!email) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "title": "Email address is required"
      }
    ]
  });

  if (!validEmail.test(email)) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "title": "Email address must be valid"
      }
    ]
  });

  if (!password) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "title": "Password is required"
      }
    ]
  });

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
  await createAccount(email, passwordHash, personId, accountId);

  return res.status(201).json({
    links: {
      self: req.headers['x-rewrite-url'] + '/' + accountId
    },
    data: {
      type: 'accounts',
      id: accountId,
      attributes: {
        email: email,
      }
    }
  });
}