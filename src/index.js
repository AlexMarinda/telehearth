import express from 'express';
//import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';
//import AuthControllerr from './controllers/payment_auth';
//import joiErrors from './middlewares/joiErrors';
//import log from './middlewares/log';

dotenv.config();

const app = express();

//app.use(cors());
app.use(express.json({ limit: '50mb' }));
//app.use(log);
app.use(router);

app.use(
  express.urlencoded({
    extended: false,
  }),
);

//app.use(joiErrors());

app.use('*', (req, res) =>
  res.status(404).json({
    message: 'API endpoint not found!',
  }),
);

/*const cronJob = require('cron').CronJob;*/

//const job = new cronJob({
//  cronTime: '*/1 * * * *',
 /* onTick() {
    AuthControllerr.auth();
  },
  start: false,
  timeZone: 'Asia/Kolkata',
});
job.start();*/
export default app;
