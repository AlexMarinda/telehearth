import fetch from 'node-fetch';
import { tokenn } from '../helpers/cron';
import DbHelper from '../helpers/DbHelper';

// const tt = tokenn();
class MtController {
  static async singleTrans(req, res) {
  // console.log(token);
    const token = await tokenn();
    // console.log(token);
    // const data={
    //   trxRef: 'B2623ED2-CBA6-4B3C-B9B8-6BE48EA062',
    //
    // }

    const data = {
      trxRef: 'B2623ED2-CBA6-4B3C-B9B8-6BE4138A3261',
      accountId: 'e03b44e4-629a-489f-a1fe-7507700c2748',
      channelId: 'momo-mtn-rw',
      msisdn: req.body.msisdn,
      amount: req.body.amount,
      callback: 'https://your-callback.example-app.com',
    };
    CREATE TABLE IF NOT EXISTS payment(
        payment_id SERIAL PRIMARY KEY,
        trxRef VARCHAR (250) ,
        description VARCHAR (250) ,
        type VARCHAR (255) ,
        amount VARCHAR (255) ,
        patient_id INTEGER ,
        patient_name VARCHAR (255),
        phone_number VARCHAR (15),
        FOREIGN KEY (patient_id) REFERENCES patients (patient_id)
      )
    // const a = JSON.stringify({ data });
    // trxRef: 'B2623ED2-CBA6-4B3C-B9B8-6BE48EA062',
    // channelId: 'momo-mtn-rw',
    // accountId: 'e03b44e4-629a-489f-a1fe-7507700c2748',
    // msisdn: '0785642275',
    // amount: 20000,
    // let a=req.body.channelId;
    const auth = `Bearer ${token}`;

    fetch('https://payments-api.fdibiz.com/v2/momo/pull', {
      method: 'post',
      headers: { 'content-type': 'application/json', authorization: auth },
      body: JSON.stringify(data),

      mode: 'cors',
    })
      .then(async (ress) => {
        if (ress.ok) {
        // const a = await res.json();
        // console.log(a.accounts.balanceAvailable);

          return await ress.json();
        }
        const er = ress.data;
        console.log('something wrong');
        res.status(500).send({ status: 500, message: 'canot reach on payment gatway', ...er });
        console.log(er);
      })
      .then((json) => {
      // json.data;
      // const t =json.data;
        const result = json.data;
        const { response: result } = await DbHelper.insert('token', tokenn, 'id', 1);
        const { rows: items, rowCount: counts } = result;
        if (counts > 0) {
          const [item] = items;
          delete item.id;
          console.log(item);

          console.log(token);
        }
        console.log(result);
        // return result;
        return res.status(200).send({
          status: 200,
          data:
            { ...result },
        });
      });
  }
 
}

  
export default MtController;
