import { app } from 'mu';
import login from './routes/login';
import register from './routes/register';
import { updatePerson, updatePostalAddress } from './routes/update';
import current from './routes/current';
import logout from './routes/logout';
import deleteCurrentAccount from './routes/deleteCurrentAccount';
import changePassword from './routes/changePassword';

app.use('*', (req, res, next) => {
  if (!req.is('application/vnd.api+json')) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "detail": "Content-Type has to be set to 'application/vnd.api+json'"
      }
    ]
  });


  if (!req.headers['mu-session-id']) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "detail": "mu-session-id header is missing'"
      }
    ]
  });
  next();
});


/**
 *  Higher order caller function for global error handling. 
 *  this will catch errors, alternative for try/catch
*/
const use = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.patch('/people/*', use(updatePerson));
app.patch('/postal-addresses/*', use(updatePostalAddress));
app.post('/sessions', use(login));
app.post('/accounts', use(register));
app.get('/sessions/current', use(current));
app.delete('/sessions/current', use(logout));
app.delete('/accounts/current', use(deleteCurrentAccount));
app.patch('/accounts/current/changePassword', use(changePassword));

// Error handling middleware
app.use(function(err, req, res, next){
  console.log(err);
  res.status(500).json({
    errors: [{ title: "Something went wrong" }]
  });
});
