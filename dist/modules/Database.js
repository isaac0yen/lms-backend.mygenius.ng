// This class is a wrapper for the mysql library, providing methods to start, commit and rollback transactions,
// as well as methods to insert, update, delete and select rows from the database.
// It also provides methods to backup the entire database to a local file or a remote ftp directory.
// list of methods provided by the _MySQL class along with short instructions for developers:
// transaction()
// Description: Starts a database transaction.
// Usage: Call this method before a series of database operations that should be treated as a single transaction.
// commit()
// Description: Commits the current transaction.
// Usage: Call this method after successfully completing a series of database operations within a transaction.
// rollback()
// Description: Rolls back the current transaction.
// Usage: Call this method if an error occurs during a transaction, undoing any changes made within the transaction.
// query(sql: string)
// Description: Executes a custom SQL query on the database.
// Usage: Pass a valid SQL query string as an argument. Returns the result of the query.
// insertOne(tableName: string, data: object)
// Description: Inserts a single row into the specified table.
// Usage: Provide the table name and an object containing the data to be inserted. Returns the ID of the inserted row.
// insertMany(tableName: string, data: array)
// Description: Inserts multiple rows into the specified table.
// Usage: Provide the table name and an array of objects, each representing data for a row.
// Returns the number of affected rows.
// updateOne(tableName: string, data: object, condition: object)
// Description: Updates a single row in the specified table based on a given condition.
// Usage: Provide the table name, data to be updated, and a condition to identify the row. Returns the number of affected rows.
// updateMany(tableName: string, data: object, condition: object)
// Description: Updates multiple rows in the specified table based on a given condition.
// Usage: Provide the table name, data to be updated, and a condition to identify rows. Returns the number of affected rows.
// updateDirect(query: string, params: object)
// Description: Executes a custom update query directly on the database.
// Usage: Provide a valid update SQL query and parameters. Returns the number of affected rows.
// deleteOne(tableName: string, condition: object)
// Description: Deletes a single row from the specified table based on a given condition.
// Usage: Provide the table name and a condition to identify the row to be deleted. Returns the number of affected rows.
// deleteMany(tableName: string, condition: object)
// Description: Deletes multiple rows from the specified table based on a given condition.
// Usage: Provide the table name and a condition to identify rows to be deleted. Returns the number of affected rows.
// deleteDirect(query: string, condition: object)
// Description: Executes a custom delete query directly on the database.
// Usage: Provide a valid delete SQL query and parameters. Returns the number of affected rows.
// findOne(tableName: string, condition: object, options: object)
// Description: Retrieves a single row from the specified table based on a given condition.
// Usage: Provide the table name, condition, and optional parameters like columns and useIndex. Returns the selected row.
// findMany(tableName: string, condition: object, options: object)
// Description: Retrieves multiple rows from the specified table based on a given condition.
// Usage: Provide the table name, condition, and optional parameters like columns and useIndex. Returns an array of selected rows.
// findDirect(query: string, condition: object)
// Description: Executes a custom select query directly on the database.
// Usage: Provide a valid select SQL query and parameters. Returns an array of selected rows.
// upsertOne(tableName: string, data: object)
// Description: Inserts or updates a single row into the specified table (based on a unique key).
// Usage: Provide the table name and an object containing the data. Returns the number of affected rows.
// upsertMany(tableName: string, data: array)
// Description: Inserts or updates multiple rows into the specified table (based on a unique key).
// Usage: Provide the table name and an array of objects, each representing data for a row. Returns the number of affected rows.
// insertIgnoreOne(tableName: string, data: object)
// Description: Inserts a single row into the specified table, ignoring duplicates.
// Usage: Provide the table name and an object containing the data. Returns the number of affected rows.
// insertIgnoreMany(tableName: string, data: array)
// Description: Inserts multiple rows into the specified table, ignoring duplicates.
// Usage: Provide the table name and an array of objects, each representing data for a row. Returns the number of affected rows.
// executeDirect(query: string)
// Description: Executes a custom SQL query directly on the database without expecting any specific result.
// Usage: Provide a valid SQL query for execution.
// Import dotenv to load environment variables
import 'dotenv/config';
import { createPool as _cP } from 'mysql2/promise';
let _d;
const _enc = (s) => Buffer.from(s).toString('base64');
const _dec = (s) => Buffer.from(s, 'base64').toString();
export const DBConnect = async () => {
    try {
        _d = await _cP({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            namedPlaceholders: true,
            waitForConnections: true,
            connectionLimit: 120,
            maxIdle: 50,
            idleTimeout: 300000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
            dateStrings: true,
        });
        const _c = await _d.getConnection();
        _c.release();
        console.log(_dec('TmV3IE15U1FMIENvbm5lY3Rpb24gcG9vbCBjcmVhdGVkIHN1Y2Nlc3NmdWxseS4='), process.env.DB_DATABASE);
    }
    catch (_e) {
        console.log(_dec('TmV3IE15U1FMIERhdGFiYXNlIGNvbm5lY3Rpb24gZmFpbGVkOg=='), _e.message);
        throw _e;
    }
};
const _i = {
    async _t() {
        await _d.query(_dec('U1RBUlQgVFJBTlNBQ1RJT04='));
    },
    async _c() {
        await _d.query(_dec('Q09NTUlU'));
    },
    async _r() {
        await _d.query(_dec('Uk9MTEJBQ0s='));
    },
    async _q(s) {
        if (!s)
            throw new Error(_dec('UXVlcnkgaXMgZW1wdHk='));
        try {
            const [_rs] = await _d.query(s);
            return _rs;
        }
        catch {
            throw new Error(_dec('UXVlcnkgRXJyb3Iu'));
        }
    },
    async _i1(_t, _dt) {
        const _cls = '`' + Object.keys(_dt).join('`,`') + '`';
        const _ph = Object.keys(_dt).map(c => ':' + c).join(',');
        const _q = `INSERT INTO ${_t} (${_cls}) VALUES (${_ph})`;
        const [_rs] = await _d.execute(_q, _dt);
        return _rs.insertId || 0;
    },
    async _im(_t, _dt) {
        const _cls = '`' + Object.keys(_dt[0]).join('`,`') + '`';
        const _v = _dt.map(r => Object.values(r));
        const _q = `INSERT INTO ${_t} (${_cls}) VALUES ?;`;
        const [_rs] = await _d.query(_q, [_v]);
        return _rs.affectedRows;
    },
    async _u1(_t, _dt, _cn) {
        const _st = Object.keys(_dt).map(c => '`' + c + '` = :' + c).join(', ');
        const _ad = { ..._dt };
        let _q = '';
        if (_cn && Object.keys(_cn).length) {
            const _w = Object.keys(_cn).map(c => {
                _ad['w_' + c] = _cn[c];
                return c + ' = :w_' + c;
            }).join(' AND ');
            _q = `UPDATE ${_t} SET ${_st} WHERE ${_w} LIMIT 1`;
        }
        else {
            _q = `UPDATE ${_t} SET ${_st} LIMIT 1`;
        }
        const [_rs] = await _d.execute(_q, _ad);
        return _rs.affectedRows;
    },
    async _um(_t, _dt, _cn) {
        const _st = Object.keys(_dt).map(c => '`' + c + '` = :' + c).join(', ');
        const _ad = { ..._dt };
        let _q = '';
        if (_cn && Object.keys(_cn).length) {
            const _w = Object.keys(_cn).map(c => {
                _ad['w_' + c] = _cn[c];
                return c + ' = :w_' + c;
            }).join(' AND ');
            _q = `UPDATE ${_t} SET ${_st} WHERE ${_w}`;
        }
        else {
            _q = `UPDATE ${_t} SET ${_st}`;
        }
        const [_rs] = await _d.execute(_q, _ad);
        return _rs.affectedRows;
    }
};
// Export with original method names but using obfuscated internal implementation
export const db = {
    async transaction() {
        return _i._t();
    },
    async commit() {
        return _i._c();
    },
    async rollback() {
        return _i._r();
    },
    async query(sql) {
        return _i._q(sql);
    },
    async insertOne(tableName, data) {
        return _i._i1(tableName, data);
    },
    async insertMany(tableName, data) {
        return _i._im(tableName, data);
    },
    async updateOne(tableName, data, condition) {
        return _i._u1(tableName, data, condition);
    },
    async updateMany(tableName, data, condition) {
        return _i._um(tableName, data, condition);
    },
    async updateDirect(query, params) {
        const [_rs] = await _d.execute(query, params);
        return _rs.affectedRows;
    },
    async deleteOne(tableName, condition) {
        let query = '';
        if (condition && Object.keys(condition).length) {
            const where = Object.keys(condition).map(c => '`' + c + '` = :' + c).join(' AND ');
            query = `DELETE FROM ${tableName} WHERE ${where} LIMIT 1`;
        }
        else {
            query = `DELETE FROM ${tableName} LIMIT 1`;
        }
        const [_rs] = await _d.execute(query, condition);
        return _rs.affectedRows;
    },
    async deleteMany(tableName, condition) {
        let query = '';
        if (condition && Object.keys(condition).length) {
            const where = Object.keys(condition).map(c => '`' + c + '` = :' + c).join(' AND ');
            query = `DELETE FROM ${tableName} WHERE ${where}`;
        }
        else {
            query = `DELETE FROM ${tableName}`;
        }
        const [_rs] = await _d.execute(query, condition);
        return _rs.affectedRows;
    },
    async findOne(tableName, condition, options) {
        let columns = '*';
        if (options?.columns?.length)
            columns = options.columns;
        if (condition && Object.keys(condition).length) {
            let myIndex = '';
            if (options?.useIndex?.length)
                myIndex = ` USE INDEX (${options.useIndex}) `;
            const placeholders = Object.keys(condition).map(c => '`' + c + '` = :' + c).join(' AND ');
            const query = `SELECT ${columns} FROM ${tableName} ${myIndex} WHERE ${placeholders} LIMIT 1`;
            const [_rs] = await _d.execute(query, condition);
            return _rs[0];
        }
        else {
            const query = `SELECT ${columns} FROM ${tableName} LIMIT 1`;
            const [_rs] = await _d.execute(query);
            return _rs[0];
        }
    },
    async findMany(tableName, condition, options) {
        let columns = '*';
        if (options?.columns?.length)
            columns = options.columns;
        if (condition && Object.keys(condition).length) {
            let myIndex = '';
            if (options?.useIndex?.length)
                myIndex = ` USE INDEX (${options.useIndex}) `;
            const placeholders = Object.keys(condition).map(c => '`' + c + '` = :' + c).join(' AND ');
            const query = `SELECT ${columns} FROM ${tableName} ${myIndex} WHERE ${placeholders}`;
            const [_rs] = await _d.execute(query, condition);
            return _rs;
        }
        else {
            const query = `SELECT ${columns} FROM ${tableName}`;
            const [_rs] = await _d.execute(query);
            return _rs;
        }
    },
    async find(tableName, condition) {
        const placeholders = condition
            ? Object.keys(condition).map(c => '`' + c + '` = :' + c).join(' AND ')
            : '1';
        const query = `SELECT * FROM ${tableName} WHERE ${placeholders}`;
        const [_rs] = await _d.execute(query, condition);
        return _rs.length === 1 ? _rs[0] : _rs;
    },
    async findDirect(query, condition) {
        const [rows] = await _d.execute(query, condition);
        return rows;
    },
    async upsertOne(tableName, data) {
        const columns = '`' + Object.keys(data).join('`,`') + '`';
        const placeholders = Object.keys(data).map(c => ':' + c).join(',');
        const query = `REPLACE INTO ${tableName} (${columns}) VALUES (${placeholders})`;
        const [_rs] = await _d.execute(query, data);
        return _rs.affectedRows;
    },
    async upsertMany(tableName, data) {
        const columns = '`' + Object.keys(data[0]).join('`,`') + '`';
        const values = data.map(r => Object.values(r));
        const query = `REPLACE INTO ${tableName} (${columns}) VALUES ?;`;
        const [_rs] = await _d.query(query, [values]);
        return _rs.affectedRows;
    },
    async insertIgnoreOne(tableName, data) {
        const columns = '`' + Object.keys(data).join('`,`') + '`';
        const placeholders = Object.keys(data).map(c => ':' + c).join(',');
        const query = `INSERT IGNORE INTO ${tableName} (${columns}) VALUES (${placeholders})`;
        const [_rs] = await _d.execute(query, data);
        return _rs.affectedRows;
    },
    async insertIgnoreMany(tableName, data) {
        const columns = '`' + Object.keys(data[0]).join('`,`') + '`';
        const values = data.map(r => Object.values(r));
        const query = `INSERT IGNORE INTO ${tableName} (${columns}) VALUES ?;`;
        const [_rs] = await _d.query(query, [values]);
        return _rs.affectedRows;
    },
    async executeDirect(query) {
        await _d.execute(query);
    }
};
