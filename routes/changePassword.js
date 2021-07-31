import bcrypt from 'bcrypt';
import { HASH_STRENGTH } from '../config';
import { selectAccountBySession, selectPasswordhashByAccount } from '../queries/select';
import { updatePasswordHashByAccount } from '../queries/update';
import parseResults from '../utils/parse-results';

export default async function changePassword(req, res) {
  const { data: { attributes: { currentPassword, newPassword } } } = req.body;

  if (!newPassword) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "detail": "A new password is required"
      }
    ]
  });

  const sessionUri = req.headers['mu-session-id'];

  try {
    // find accountURI for this session
    const accountResult = await selectAccountBySession(sessionUri);
    const { accountUri } = parseResults(accountResult);

    // find currentPasswordHash by accountURI
    const passwordResult = await selectPasswordhashByAccount(accountUri);
    const { passwordhash } = parseResults(passwordResult);
    
    // Check if current and given password matches
    const passwordsMatch = await bcrypt.compare(currentPassword, passwordhash);

    if(!passwordsMatch) {
      return res.status(400).json({
        "errors": [
          {
            "status": "400",
            "detail": "New password does not match current one"
          }
        ]
      });
    }
    
    // Update new password in db
    const newPasswordHash = await bcrypt.hash(newPassword, HASH_STRENGTH);
    await updatePasswordHashByAccount(accountUri, newPasswordHash);

    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
}