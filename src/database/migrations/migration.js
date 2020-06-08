import dbCon from '../../config/connection';

const dropAllTables = async () => {
  const client = await dbCon.connect();
  try {
    const dropTables = 'DROP TABLE IF EXISTS  patients,doctors';
    await client.query(dropTables);
  } finally {
    client.release();
  }
};

const patientss = async () => {
  const client = await dbCon.connect();
  try {
    const query = `CREATE TABLE IF NOT EXISTS patients(
      patient_id SERIAL PRIMARY KEY,
      email VARCHAR (1000) NOT NULL,
      first_name VARCHAR (255) ,
      last_name VARCHAR (255) ,
      gender  VARCHAR (255) ,
      country VARCHAR (255) ,
      city VARCHAR (255) ,
      street_address VARCHAR (50),
      house_number VARCHAR (50),
      pic VARCHAR (255) ,
      copy_id VARCHAR (255) ,
      password VARCHAR (255),
      dob  VARCHAR(50),
      phone_number VARCHAR(13) NOT NULL,
      created_on TIMESTAMP
    );`;
    await client.query(query);
  } finally {
    client.release();
  }
};
const doctorss = async () => {
  const client = await dbCon.connect();
  try {
    const query = `CREATE TABLE IF NOT EXISTS doctors(
      doctor_id SERIAL PRIMARY KEY,
      email VARCHAR (250),
      first_name VARCHAR (250),
      last_name VARCHAR (250),
      country VARCHAR (250),
      city VARCHAR (250),
      gender VARCHAR (250),
      tel VARCHAR (250),
      pic VARCHAR (250),
      copy_id VARCHAR (250),
      password  VARCHAR (250),
      dob VARCHAR (250),
      course VARCHAR (250),
      graduete_year VARCHAR (250),
      college VARCHAR (250),
      certificate VARCHAR (250),
      professional_bio VARCHAR (250),
      language VARCHAR (250),
      specialities VARCHAR (250),
      experience VARCHAR (250),
      start_year VARCHAR (250),
      no_practice VARCHAR (250),
      created_on TIMESTAMP
    );`;
    await client.query(query);
  } finally {
    client.release();
  }
};

(async () => {
  await dropAllTables();

  await patientss();
  await doctorss();
  //await insertData();
})().catch(() => {
});
