import bcrypt from 'bcrypt';
import { createSession } from '../queries/create';
import { selectAccountByEmail } from '../queries/select';

const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export default async function login(req, res){
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
  
  try {
    var { accountUri, passwordHash } = await selectAccountByEmail(email);

    const passwordMatches = await bcrypt.compare(password, passwordHash)

    if (!accountUri || !passwordMatches) return res.status(400).json({
      "errors": [
        {
          "status": "400",
          "detail": "Given email or password is incorrect"
        }
      ]
    });

  } catch (err) {
    return res.status(500).send(err);
  }
  
  createSession(accountUri, req.headers['mu-session-id']);
  const sessionId = req.headers['mu-session-id'].split('/').pop();
  const accountId = accountUri.split('/').pop();

  return res.status(201).json({
    links: {
      self: req.headers['x-rewrite-url'] + '/' + accountId
    },
    data: {
      type: 'sessions',
      id: sessionId,
    },
    relationships: {
      account: {
        links: {
          related: `/accounts/${accountId}`
        },
        data: {
          type: "accounts",
          id: accountId
        }
      }
    }
  })
}