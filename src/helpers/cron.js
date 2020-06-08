import DbHelper from './DbHelper';

const tokenn = async () => {
  const { response: result } = await DbHelper.findOne('token', 'id', 1);
  const { rows: items, rowCount: counts } = result;
  if (counts > 0) {
    const [item] = items;
    delete item.id;
    const tokent = item.token;
    //console.log(tokent);
    return tokent;
  }
};
export { tokenn };
