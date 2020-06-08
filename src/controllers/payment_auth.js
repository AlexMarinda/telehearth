import fetch from 'node-fetch';
import DbHelper from '../helpers/DbHelper';
import client from '../config/connection';

class AuthControllerr {
  static auth() {
    let result;
    fetch('https://payments-api.fdibiz.com/v2/auth', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        appId: 'e03b44e4-629a-489f-a1fe-7507700c2748',
        secret: '2c388a26-427b-4a07-ac14-a10c76dd7e9e',
      }),
      mode: 'cors',
    })


      .then(async (res) => {
        if (res.ok) {
          // eslint-disable-next-line no-return-await
          return await res.json();
        }
        console.log(res);
        // document.getElementById('repo').innerText = 'invalid email or password';

        // x.style.display = "block";
      })
      .then(async (json) => {
        if (typeof (json) !== 'undefined') {
          const { token } = json.data;
          // localStorage.setItem('token ', token);
          // location = 'get.html';
          const tokenn = { token };
          result = await client.query(`UPDATE token SET token='${token}'   WHERE   id=${1} returning *`);
         // const { response: result } = await DbHelper.update('token', tokenn, 'id', 1);
          const { rows: items, rowCount: counts } = result;
          if (counts > 0) {
            const [item] = items;
            delete item.id;
            console.log(item);

            console.log(token);
          }
        }
      });
  }
}
export default AuthControllerr;
