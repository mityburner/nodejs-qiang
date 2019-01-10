const mysql = require('mysql');

class DB {
    constructor(options){
        this.pool = mysql.createPool(options);
        process.on('exit', code => this.end_mysql(code));
    }
    end_mysql(code) {
        this.pool.end();
    }
    format(sql, params){
        return mysql.format(sql, params);
    }
    query(sql, params, cb){
        this.pool.getConnection((err, conn) => {
            if(err) return cb(err);
            conn.query(sql, params, (err, ret, fields) => {
                conn.release();
                if(err) return cb(err);
                cb(null, ret);
            })
        });
    }
}

module.exports = DB;
