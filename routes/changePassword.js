import bcrypt from 'bcrypt';
import { HASH_STRENGTH } from '../config';
import { selectAccountBySession, selectPasswordhashByAccount } from '../queries/select';
import { updatePasswordHashByAccount } from '../queries/update';

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

  const sessionUri = req.headers['mu-session-id']

  try {
    const { accountUri } = await selectAccountBySession(sessionUri);
    const { passwordhash } = await selectPasswordhashByAccount(accountUri);
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
    const newPasswordHash = await bcrypt.hash(newPassword, HASH_STRENGTH);
    await updatePasswordHashByAccount(accountUri, newPasswordHash);
    console.log(newPasswordHash, passwordhash)
    
  } catch (err) {
    return res.status(500).send(err);
  }

  res.sendStatus(204)
}