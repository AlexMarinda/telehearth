import { Pool } from 'pg';
import dotenv from 'dotenv';
import Joi from '@hapi/joi';

dotenv.config();

// databse connection
const { DATABASE_URL } = process.env;

const connectionString = DATABASE_URL;
export const pool = new Pool({
  connectionString,
});

class DbHelper {
  //  query function
  static async query(query, params) {
    try {
      const client = await pool.connect();
      const result = await client.query(query, params);
      client.release();
      return { error: null, response: result };
    } catch (Error) {
      return { error: Error, response: null };
    }
  }

  // query all from any table
  static async queryAll(tablename) {
    if (tablename) {
      const q = `SELECT * FROM ${tablename}`;
      return DbHelper.query(q);
    }
    return { error: 'provide table name', response: null };
  }

  // find all column according to whare condition from table
  static async findAll(tablename, column, value) {
    if (tablename && column && value) {
      const q = `SELECT * FROM ${tablename} WHERE ${column}=$1`;
      return DbHelper.query(q, [value]);
    }
    return { error: 'provide table name & column & value', response: null };
  }

  // find one column according  to where condition from any table
  static async findOne(tablename, column, value) {
    if (tablename && column && value) {
      const q = `SELECT * FROM ${tablename} WHERE ${column}=$1 LIMIT 1`;
      return DbHelper.query(q, [value]);
    }
    return { error: 'provide table name & column & value', response: null };
  }


  // insert data in any table
  static async insert(tablename, data) {
    //  build query
    const qry = `INSERT INTO ${tablename}`;
    const queryBuilder = DbHelper.buildInsert(qry, data);
    return DbHelper.query(queryBuilder.sql, queryBuilder.values);
  }

  // delete any data from any table using key
  static async deleteItem(tablename, key, key1, value, value1) {
    if (tablename && key && value) {
      const qry = `DELETE FROM ${tablename} WHERE ${key}=$1 AND ${key1}=$2`;
      return DbHelper.query(qry, [value, value1]);
    }
    return { error: 'provide table name & column & value', response: null };
  }

  // build insert function
  static buildInsert(query, data) {
    const params = [];
    const allData = [];
    const values = [];
    const keys = [];
    Object.keys(data).forEach((key) => {
      keys.push(key);
      params.push(data[key]);
      values.push(`$${params.length}`);
    });
    allData.push(`(${values.join(', ')})`);
    return {
      sql: `${query}(${keys.join(', ')}) values${allData.join(', ')} RETURNING *`,
      values: params,
    };
    query;
  }

  // update data from any table
  static async update(tablename, data, whereClause, condition) {
    if (tablename && data && whereClause && condition) {
      //  build query
      const qry = `UPDATE ${tablename} SET `;
      const { sql } = DbHelper.buildUpdate(qry, data, whereClause, condition);
      return DbHelper.query(sql);
    }
    return { error: 'provide table name & data & whereclause & condition', response: null };
  }

  // build update function
  static buildUpdate(query, data, whereClause, condition) {
    const allData = [];
    Object.keys(data).forEach((key) => {
      allData.push(`${key}='${data[key]}'`);
    });
    return {
      sql: `${query} ${allData.join(', ')} WHERE ${whereClause}=${condition} RETURNING *`,
    };
  }
}

export default DbHelper;
