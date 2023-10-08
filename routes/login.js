import bcrypt from 'bcrypt';
import { ACCOUNT_INACTIVE_STATUS } from '../config';
import { createSession } from '../queries/create';
import { selectAccountByEmail } from '../queries/select';
import parseResults from '../utils/parse-results';
import responseFromCurrent from './current';

const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export default async function login(req, res){
  const { data: { attributes: { email, password } } } = req.body;

  /**
   * REQUEST VALIDATION -> HasEmail, IsValidEmail, HasPassword
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
  
  // find accountUri & passwordHash by given email
  // note: passwordHash set to empty string by default for bcrypt to process
  const result = await selectAccountByEmail(email);
  const { accountUri, passwordHash = "" , status} = parseResults(result);

  if (status == ACCOUNT_INACTIVE_STATUS) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "title": "Account attached to this email is deleted"
      }
    ]
  });

  const passwordMatches = await bcrypt.compare(password, passwordHash);

  // Return 400 if accountURI does not exist, no passwordHash is found or password does not match
  if (!accountUri || !passwordHash || !passwordMatches) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "title": "Given email or password is incorrect"
      }
    ]
  });

  //Create new session in db
  await createSession(accountUri, req.headers['mu-session-id']);
  
  // Same response as current (will re-fetch);
  return await responseFromCurrent(req,res);
}
