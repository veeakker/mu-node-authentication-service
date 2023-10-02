import { selectAccountBySession, selectAccountInfo } from "../queries/select";
import parseResults from "../utils/parse-results";

export default async function current(req, res) {
  const sessionUri = req.headers['mu-session-id'];

  // find accountURI for this session
  const result = await selectAccountBySession(sessionUri);
  const { accountUri, userGraph } = parseResults(result);

  if (!accountUri) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "title": "Invalid Session"
      }
    ]
  });

  const accountId = accountUri.split('/').pop();
  const accountInfo = (await selectAccountInfo(userGraph)).results.bindings[0];

  return res.status(201).json({
    links: {
      self: req.headers['x-rewrite-url'] + '/' + accountId
    },
    data: {
      type: 'sessions',
      id: sessionUri,
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
    },
    included: [{
      // account
      type: "accounts",
      id: accountId,
      attributes: {
        email: accountInfo.email.value
      },
      relationships: {
        person: {
          links: null,
          data: {
            type: "persons",
            id: accountInfo.personUuid.value
          }
        }
      }
    },{
      // user
      type: "persons",
      id: accountInfo.personUuid.value,
      attributes: {
        "first-name": accountInfo.firstName.value,
        "last-name": accountInfo.lastName.value,
        email: accountInfo.email.value,
        phone: accountInfo.phone.value,
      },
      relationships: {
        "postal-address": {
          links: null,
          data: {
            type: "postal-addresses",
            id: accountInfo.postalAddressUuid.value
          }
        }
      }
    },{
      type: "postal-addresses",
      id: accountInfo.postalAddressUuid.value,
      attributes: {
        country: accountInfo.country.value,
        locality: accountInfo.locality.value,
        "postal-code": accountInfo.postalCode.value,
        "street-address": accountInfo.streetAddress.value
      },
      relationships: { }
    }]
  });
}
