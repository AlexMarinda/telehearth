import axios from 'axios';
import 'dotenv/config';

export const httpMTN = axios.create({
  baseURL: process.env.PSF_PAYMENTS_ENDPOINT,
});
