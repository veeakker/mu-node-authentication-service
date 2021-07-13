import { app, errorHandler } from 'mu';
import router from './routes/router';

app.use(router);
app.use(errorHandler);

process.on('unhandledRejection', (reason, p) => {
  // application specific logging, throwing an error, or other logic here
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason); 
});
