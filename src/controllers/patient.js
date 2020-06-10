import moment from 'moment';
import multer from 'multer' ;
import jwt from 'jsonwebtoken';
import patients from '../model/users';
import payLoad from '../helpers/payload';
import client from '../config/connection';
import { generateToken, encryptPass, checkPassword } from '../helpers';
/*const upload =multer({dest: 'uploads/'})
const storage =multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './upload/');


  },
 filename: function(req, file, cb){
    cb(null, new Date().toISOString() + file.filename)

  }
}
);


const fileFilter = (req, file, cb) =>{
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  }else{
    cb(null, false);
  }
  
  
};
const upload = multer({storage: storage, limit:{
  fileSize: 1024 * 1024 * 5
}});*/


// class contain all user operation
class UserController {
  // new user


 /* app.post('/uploadphoto', upload.single('picture'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
 var encode_image = img.toString('base64');
 // Define a JSONobject for the image attributes for saving to database
  
 var finalImg = {
      contentType: req.file.mimetype,
      image:  new Buffer(encode_image, 'base64')
   };
db.collection('quotes').insertOne(finalImg, (err, result) => {
    console.log(result)
 
    if (err) return console.log(err)
 
    console.log('saved to database')
    res.redirect('/')
   
     
  })
})*/
  static async registerUser(req, res) {
//upload.single('image_url');
    const newUser = [
      req.body.email,
      req.body.first_name,
      req.body.last_name,
      req.body.gender,
      req.body.country,
      req.body.city,
      req.body.street_address,
      req.body.house_number,
      req.body.pic,
      req.body.copy_id,
      encryptPass(req.body.password),
      req.body.dob,
      req.body.phone_number,
      moment().format(),
      //req.file.path,
    ];

    const sql = await client.query(`SELECT *
  FROM patients WHERE email='${req.body.email}'`);
    const { rowCount } = sql;

    if (rowCount > 0) {
      return res.status(409).send({ status: 409, message: 'choose another email this was taken' });
    }

    const { rows } = await client.query(`INSERT INTO
    patients (email,first_name,last_name,gender,country,city,street_address,house_number,pic,copy_id,password,dob,phone_number,created_on) 
 VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12,$13,$14) returning *`, newUser);


    const result = rows;
    const [payload] = result;
    const token = generateToken(payload);
    const {
      patient_id,
      email,
      first_name,
      last_name,
    } = result[0];

    patients.push(newUser);
    return res.status(201).send({
      status: 201,

      message: 'succefully',
      data: {
        token,
        patient_id,
        email,
        first_name,
        last_name,
        //image_url,
      },

    });
  }

  // user signin function
  static async login(req, res) {
    const sql = await client.query(`SELECT *
  FROM patients WHERE email='${req.body.email}'`);

    const { rows, rowCount } = sql;


    if (rowCount > 0) {
    // compare password
      const [currentUser] = rows;
      if (checkPassword(currentUser.password, req.body.password)) {
        const token = generateToken(currentUser);
        const {
          patient_id,
          email,
          first_name,
          last_name,

        } = currentUser;

        return res.status(200).send({
          status: 200,
          message: 'user login succefully',
          data: {
            token,
            patient_id,
            email,
            first_name,
            last_name,

          },
        });
      }
    }


    return res.status(401).send({ status: 401, message: 'User not found!' });
  }

    // user Edit patient function
    static async editPatient(req, res) {
      let result;
      const getUser = jwt.decode(req.headers.authorization.split(' ')[1]);
      const sql = await client.query(`SELECT *
  FROM patients WHERE  patient_id=${req.params.patient_id}`);
      const { rows, rowCount } = sql;
  
  
      if (rowCount > 0) {
      const [findPatient] = rows;
        if (getUser.patient_id === findPatient.patient_id) {
          if (req.body.email) {
            result = await client.query(`UPDATE patients SET email='${req.body.email}'   WHERE   patient_id=${req.params.patient_id} returning *`);
          }
          if (req.body.first_name) {
            result = await client.query(`UPDATE patients SET title='${req.body.first_name}'   WHERE   patient_id=${req.params.patient_id} returning *`);
          }
          if (req.body.country) {
            result = await client.query(`UPDATE patients SET country='${req.body.country}'   WHERE   patient_id=${req.params.patient_id} returning *`);
          }
          if (req.body.city) {
            result = await client.query(`UPDATE patients SET city='${req.body.city}'   WHERE   patient_id=${req.params.patient_id} returning *`);
          }
          if (req.body.street_address) {
            result = await client.query(`UPDATE patients SET street_address='${req.body.street_address}'   WHERE   patient_id=${req.params.patient_id} returning *`);
          }
          if (req.body.house_number) {
            result = await client.query(`UPDATE patients SET house_number='${req.body.house_number}'   WHERE   patient_id=${req.params.patient_id} returning *`);
          }

          if (req.body.phone_number) {
            result = await client.query(`UPDATE patients SET phone_number='${req.body.phone_number}'   WHERE   patient_id=${req.params.patient_id} returning *`);
          }
          if (req.body.currentPassword && req.body.newPassword) {
            if (checkPassword(findPatient.password, req.body.currentPassword) ) {     
             
            result = await client.query(`UPDATE patients SET password='${encryptPass(req.body.newPassword)}'   WHERE   patient_id=${req.params.patient_id} returning *`);
          }

          return res.status(400).send({
            status: 400,
            message: 'incorrect current password try again',

          });

        }
          const { rows, rowCount } = result;
  
          const [findPatients] = rows;
  
          return res.status(200).send({
            status: 200,
            message: 'successfully edited',
            data: {
              findPatients,
            },
          });
        }

        return res.status(400).send({ status: 400, message: 'You dont have privillage for editing another patient',a,b });
      }
  
      return res.status(404).send({ status: 404, message: 'patient not found!' });
    }

  // get all patient
  static async getAllPatient(req, res) {
    const limit = req.query.LIMIT || 4;
    const page = req.query.PAGE || 1;
    const offset = (page - 1) * limit;
    const sql = await client.query(`SELECT *
FROM patients LIMIT ${limit} OFFSET ${offset}`);
    const findPatient = sql.rows;
    if (findPatient) {
      findPatient.reverse();
      return res.status(200).send({
        status: 200,
        message: 'success',
        page,
        patientNumber: findPatient.length,
        data:
        findPatient,
      });
    }
    return res.status(404).send({ status: 404, message: 'patient not found!' });
  }
}
export default UserController;

