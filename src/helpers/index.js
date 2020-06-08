import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


// Generate Token


const generateToken = (payload) => {
  const token = jwt.sign(payload,
    'THIS IS MY SECRETE', { expiresIn: '7d' });
  return token;
};
// check token

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1] || req.body.token;

    if (!token && token === '') return res.status(403).send({ status: 403, message: 'Unauthorized access' });

    jwt.verify(token, 'THIS IS MY SECRETE', { expiresIn: '7d' });
    next();
  } catch (error) {
    return res.status(400).send({ status: 400, message: 'Invalid token' });
  }

  return true;
};


// encript password using bcrypt
const encryptPass = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// check password
const checkPassword = (hash, password) => bcrypt.compareSync(password, hash);


export {
  verifyToken, generateToken, encryptPass, checkPassword,
};
