import moment from 'moment';
import payLoad from '../helpers/payload';
import client from '../config/connection';
import { generateToken, encryptPass, checkPassword } from '../helpers';

// class contain all user operation
class DoctorController {
  // new user
  static async registerUser(req, res) {
    const newUser = [
      req.body.email,
      req.body.first_name,
      req.body.last_name,
      req.body.country,
      req.body.city,
      req.body.gender,
      req.body.tel,
      req.body.pic,
      req.body.copy_id,
      encryptPass(req.body.password),
      req.body.dob,
      req.body.course ,
      req.body.graduete_year ,
      req.body.college,
      req.body.certificate,
      req.body.professional_bio,
      req.body.language,
      req.body.specialities,
      req.body.experience,
      req.body.start_year,
      req.body.no_practice,
      moment().format(),
    ];

    const sql = await client.query(`SELECT *
  FROM doctors WHERE email='${req.body.email}'`);
    const { rowCount } = sql;

    if (rowCount > 0) {
      return res.status(409).send({ status: 409, message: 'choose another email this was taken' });
    }


    const { rows } = await client.query(`INSERT INTO
    doctors (email,first_name,last_name,country,city,gender,tel,pic,copy_id,password,dob,course,graduete_year,college,certificate,professional_bio,language,specialities,experience,start_year,no_practice,created_on) 
 VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) returning *`, newUser);


    const result = rows;
    const [payload] = result;
    const token = generateToken(payload);
    const {
      doctor_id,
      email,
      first_name,
      last_name,
    } = result[0];

    //doctors.push(newUser);
    return res.status(201).send({
      status: 201,

      message: 'succefully',
      data: {
        token,
        doctor_id,
        email,
        first_name,
        last_name,
      },

    });
  }

  // user signin function
  static async login(req, res) {
    let result;
    const sql = await client.query(`SELECT *
  FROM doctors WHERE email='${req.body.email}'`);

    const { rows, rowCount } = sql;


    if (rowCount > 0) {
    // compare password
      const [currentUser] = rows;
      if (checkPassword(currentUser.password, req.body.password)) {
        
        result = await client.query(`UPDATE doctors SET status='active'   WHERE   doctor_id=${currentUser.doctor_id} returning *`);
        const token = generateToken(currentUser);  
        const {
          doctor_id,
          email,
          first_name,
          last_name,
          status

        } = currentUser;

           
           // const { rowss, rowCountt } = result;
    
           // const [findDoctorss] = rowss;

        return res.status(200).send({
          status: 200,
          message: 'user login succefully',
          data: {
            token,
            doctor_id,
            email,
            first_name,
            last_name,
            status

          },
        });
      }
      return res.status(400).send({ status: 400, message: 'Incorect password or email' });
    }


    return res.status(401).send({ status: 401, message: 'User not found!' });
  }


  static async getSpecificDoctors(req, res) {
    
      const sql = await client.query(`SELECT *
FROM doctors  WHERE  specialities=${req.params.specialities}`);
      const { rows, rowCount } = sql;
      const findDoctor = rows;


     if (rowCount > 0) {
         const {
          first_name,
          last_name,
          country,
          tel,
          pic,
          dob,
          course ,
          college,
          certificate,
          professional_bio,
          language,
          specialities,
          experience,
          start_year,

        } = findDoctor[0];

        return res.status(200).send({
          status: 200,
          message: 'success',
          data: {
            findDoctor,
          },
        });
      }
      return res.status(404).send({ status: 404, message: 'doctor not found!' });
  
  }

   // get all patient
   static async getAllDoctorApproved(req, res) {
    const limit = req.query.LIMIT || 4;
    const page = req.query.PAGE || 1;
    const offset = (page - 1) * limit;
    const sql = await client.query(`SELECT *
FROM doctors WHERE LIMIT ${limit} OFFSET ${offset}`);
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


  static filterDoctor(req, res) {
    const findDoctor = doctors.filter((t) => t.specialities === req.query.specialities);
    //const findSharedDoctor = doctors.filter((t) => t.status === 'publish');

    // eslint-disable-next-line no-cond-assign
    // eslint-disable-next-line no-constant-condition

    if (findDoctor.length >= 1) {
      //if (findSharedDoctor) {
        findDoctor.reverse();

        return res.status(200).send({ status: 200, message: 'success', data: findDoctor });
     // }
    }
    return res.status(404).send({ status: 404, message: 'article not found!' });
  }
}
export default DoctorController;
