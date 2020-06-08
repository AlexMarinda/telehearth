import { SERVER_ERROR } from '../constants/statusCodes.js';
/**
 * @param  {Object} data
 * @param  {ServerResponse} res
 * @return {ServerResponse} Response
 */
const jsonResponse = (data) => {
  const status = data.status || SERVER_ERROR;
  return data.res.status(status).json({
    status,
    ...data,
    res: undefined,
  });
};

export default jsonResponse;
