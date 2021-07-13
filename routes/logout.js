import { deleteSession } from "../queries/delete";


export default async function logout(req, res){
  const sessionUri = req.headers['mu-session-id']

  try {
    await deleteSession(sessionUri)
  } catch(err){
    return res.status(500).send(err);
  }
  
  return res.status(201).send('ok');
}