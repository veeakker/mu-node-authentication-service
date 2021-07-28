import bcrypt from 'bcrypt';
import { uuid } from 'mu';
import { selectAccountCountByEmail } from "../queries/select";
import { createAccount } from "../queries/create";

const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export default async function register(req, res){
  const { data: { attributes: { email, password } } } = req.body;

  /**
   * VALIDATIONS -> HasEmail, IsValidEmail, HasPassword
   */

  if (!email) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "detail": "Email address is required"
      }
    ]
  });

  if (!validEmail.test(email)) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "detail": "Email address must be valid"
      }
    ]
  });

  if (!password) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "detail": "Password is required"
      }
    ]
  });

  /**
   * PROCESS ACCOUNT
   */

  try {
    // Check if other accounts with this email exist in db
    const { accountCount } = await selectAccountCountByEmail(email)

    if (parseInt(accountCount) != 0) {
      return res.status(400).json({
        "errors": [
          {
            "status": "400",
            "detail": "An account with this email already exists"
          }
        ]
      })
    }

    const personId = uuid();
    const accountId = uuid();
    const passwordHash = await bcrypt.hash(password, 10);

    //Create the new account
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
    })

  } catch (err) {
    res.status(500).send(err)
  }

}