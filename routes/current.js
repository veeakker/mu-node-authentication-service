import { selectAccountBySession } from "../queries/select";
import parseResults from "../utils/parse-results";

export default async function current(req, res) {
  const sessionUri = req.headers['mu-session-id'];

  try {
    // find accountURI for this session
    const result = await selectAccountBySession(sessionUri);
    const { accountUri } = parseResults(result);

    if (!accountUri) return res.status(400).json({
      "errors": [
        {
          "status": "400",
          "detail": "Invalid Session"
        }
      ]
    });

    const accountId = accountUri.split('/').pop();

    return res.status(201).json({
      links: {
        self: req.headers['x-rewrite-url'] + '/' + accountId
      },
      data: {
        type: 'sessions',
        id: sessionUri,
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
    });
  } catch (err) {
    return res.sendStatus(500);
  }
}