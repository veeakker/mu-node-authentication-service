import { deleteAccount } from "../queries/delete";
import { selectAccountBySession } from "../queries/select";

export default async function deleteCurrentAccount(req, res) {
  const sessionUri = req.headers['mu-session-id'];

  const { accountUri } = await selectAccountBySession(sessionUri);
  const result = await deleteAccount(accountUri);

  return res.status(204).json(result);
}