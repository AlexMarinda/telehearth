import moment from 'moment';


const timestamp = () => moment().format('YYYYMMDDTHHmmSSTsss');


/**
 *Generate random text
 *@return {string} text
 */
export function generateTransactionId() {
  const transactionId = `save${timestamp()}`;
  return transactionId;
}
