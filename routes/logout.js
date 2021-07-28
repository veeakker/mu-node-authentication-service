import { deleteSession } from "../queries/delete";
import { selectAccountBySession } from "../queries/select";


export default async function logout(req, res){
  const sessionUri = req.headers['mu-session-id']

  try {
    const { accountUri } = await selectAccountBySession(sessionUri);
    
    if (accountUri) {
      await deleteSession(sessionUri, accountUri)
    }
  } catch(err){
    return res.status(500).send(err);
  }

  return res.status(204).send("ok");
}

