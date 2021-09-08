import { app, errorHandler } from 'mu';
import login from './routes/login';
import register from './routes/register';
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

app.post('/sessions', login);
app.post('/accounts', register);
app.post('/sessions', login);
app.get('/sessions/current', current);
app.delete('/sessions/current', logout);
app.delete('/accounts/current', deleteCurrentAccount);
app.patch('/accounts/current/changePassword', changePassword);

app.use(errorHandler);

process.on('unhandledRejection', (reason, p) => {
  // application specific logging, throwing an error, or other logic here
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason); 
});
