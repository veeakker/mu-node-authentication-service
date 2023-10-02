import { selectAccountBySession, countMatchingPeopleForPersonId } from "../queries/select";
import { updatePerson as updatePersonQuery } from "../queries/update";
import parseResults from "../utils/parse-results";

export async function updatePerson(req,res) {
  const { data: { id, attributes: { email, phone, "first-name": firstName, "last-name": lastName } } } = req.body;

  let errors = [];

  if (!id)
    errors.push({
      "status": "400", "title": "id not supplied"
    });
  if (!email)
    errors.push({
      "status": "400", "title": "Email addres is vereist om in te kunnen loggen."
    });
  if (!firstName)
    errors.push({
      "status": "400", "title": "Voornaam moet ingegeven zijn voor latere communicatie."
    });
  if (!lastName)
    errors.push({
      "status": "400", "title": "Achternaam moet ingegeven zijn voor latere communicatie."
    });
  if (!phone)
    errors.push({
      "status": "400", "title": "Telefoonnummer moet ingegeven zijn zodat we kunnen helpen bij afhaalproblemen."
    });

  if( errors.length ) {
    res.status(400).json({errors});
  } else {
    // get the account for the current session
    const sessionUri = req.headers['mu-session-id'];
    const { accountUri, userGraph } = parseResults(await selectAccountBySession(sessionUri));

    // check if the id is part of this group
    const { matchingUserCount } = parseResults(await countMatchingPeopleForPersonId( { graph: userGraph, id } ));
    if ( parseInt(matchingUserCount) < 1 ) {
      res.status(400).json({ errors: [{status: "400", title: "Persoon id behoort niet tot ingelogde gebruiker."}]});
    } else {
      // conditionally update the id
      await updatePersonQuery( userGraph, { id, email, phone, firstName, lastName } );
      res.status(204).send();
    }
  }
}
