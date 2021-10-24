import { ACCOUNT_INACTIVE_STATUS } from "../config";
import { selectAccountBySession } from "../queries/select";
import { updateAccountStatus } from "../queries/update";
import parseResults from "../utils/parse-results";

export default async function deleteCurrentAccount(req, res) {
  const sessionUri = req.headers['mu-session-id'];

  const result = await selectAccountBySession(sessionUri);
  const { accountUri } = parseResults(result);
  
  // When deleting an account, the account status gets set to 'inactive'
  await updateAccountStatus(accountUri, ACCOUNT_INACTIVE_STATUS);

  return res.sendStatus(204);
}