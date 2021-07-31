import { deleteSession } from "../queries/delete";
import { selectAccountBySession } from "../queries/select";
import parseResults from "../utils/parse-results";


export default async function logout(req, res){
  const sessionUri = req.headers['mu-session-id'];

  try {
    // find accountURI for this session
    const result = await selectAccountBySession(sessionUri);
    const { accountUri } = parseResults(result);

    // Delete session if current account has one
    if (accountUri) {
      await deleteSession(sessionUri, accountUri);
    }

    return res.sendStatus(204);
  } catch(err){
    return res.sendStatus(500);
  }
}

