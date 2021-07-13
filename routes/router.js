import express from 'express';
import register from './register';
import login from './login';
import current from './current';
import logout from './logout';

const router = express.Router();

router.use('*', (req, res, next) => {
  if (!req.is('application/vnd.api+json')) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "detail": "Content-Type has to be set to 'application/vnd.api+json'"
      }
    ]
  })


  if (!req.headers['mu-session-id']) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "detail": "mu-session-id header is missing'"
      }
    ]
  })

  next()
})

router.post('/accounts', register);
router.post('/sessions', login);
router.get('/sessions/current', current);
router.delete('/sessions/current', logout);

export default router;
