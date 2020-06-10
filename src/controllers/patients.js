import { generateToken, encryptPass, checkPassword } from '../helpers'; 
import client from '../config/connection';
import jwt from 'jsonwebtoken';

// class contain all patient operation
class consultantController {
  // consultant 
  static async consultant(req, res) {
    const getUser = jwt.decode(req.headers.authorization.split(' ')[1]);
    const newConsulant = [
      req.body.describe_health,
      req.body.previous_issue,
      req.body.current_medication,
      req.body.past_medication,
      req.body.vital_information,
      req.body.temperature,
      req.body.blood_pressure,
      req.body.blood_sugar,
      getUser.patient_id,
      getUser.first_name,
      req.body.phone_number,
      //getUser.phone_number,
      
    ];



    const { rows } = await client.query(`INSERT INTO
    consult (describe_health,previous_issue,current_medication,past_medication,vital_information,temperature,blood_pressure,blood_sugar,patient_id,patient_name,phone_number ) 
 VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`, newConsulant);


 const result = rows;
    const {
      describe_health,
      previous_issue,
      current_medication,
      past_medication,
      vital_information,
      temperature,
      blood_pressure,
      blood_sugar,
      patient_id,
      first_name,
      phone_number,

    } = result[0];
    if (result) {
      return res.status(201).send({
        status: 201,
        message: 'health describition received please process consultant payment and choose doctor or near hospital ',
        data:
       {
        describe_health,
        previous_issue,
        current_medication,
        past_medication,
        vital_information,
        temperature,
        blood_pressure,
        blood_sugar,
        patient_id,
        first_name,
        phone_number,
       },
      });
    }
  }

  // booking
  static async booking(req, res) {

    const getUser = jwt.decode(req.headers.authorization.split(' ')[1]);
    const sql = await client.query(`SELECT *
    FROM doctors WHERE doctor_id='${req.params.doctor_id}' AND status='active' `);
  
      const { rowss, rowCount } = sql;
      const [getDoctor] = rowss;

  
      if (rowCount > 0) {
     
  

  
    const newBooking = [
      getUser.first_name,
      getDoctor.first_name,
      getUser.phone_number,
      getDoctor.phone_number,
      moment().format(),
      getDoctor.doctor_id,
      getUser.patient_id,
      
    ];

    if(getDoctor.status==="booked" ){
     
      return res.status(409).send({ status: 409,
        data: "Doctor was booked try another time or choose another"
        });
      
           
       }

    const { rows } = await client.query(`INSERT INTO
    bookings (patient_name,doctor_name,patient_tel,doctor_tel,created_on,doctor_id,patient_id) 
 VALUES($1, $2, $3, $4, $5, $6, $7) returning *`, newBooking);


 const result = rows;
    const {
      patient_name,
      doctor_name,
      patient_tel,
      doctor_tel,
      created_on,
      doctor_id,
      patient_id,

    } = result[0];
    if (result) {
      return res.status(201).send({
        status: 201,
        message: 'you have done booking a doctor please process consultant payment to get a doctor time ',
        data:
       {
        patient_name,
        doctor_name,
        patient_tel,
        doctor_tel,
        created_on,
        doctor_id,
        patient_id,
       },
      });
    }
  }
  let a=getDoctor.doctor_id;
    return res.status(401).send({ status: 401, message: 'User not found!',a });
  }





}
export default consultantController;
