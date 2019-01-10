const DB = require('./db.js');
const fs = require('fs');

class Dbo extends DB{
    constructor(options){
        super(options);
    }

    add(obj, json, cb){
        switch(obj){
            case 'list':
                let sql = "insert into list set domain=?"
                this.query(sql, [
                    json.domain
                ], (err, ret) => err? cb(err):cb(null,ret)); break;
        }
    }

    isExist(obj, json, cb){
        switch(obj){
            case 'list':
                this.query("select count(*) total from list where domain=?", [
                    json.domain
                ], (err, ret) => err? cb(err)
                                    : cb(null, ret[0].total)); break;
        }
    }

    delete(obj, json, cb){
        switch(obj){
            case 'list':
                this.query("delete from list where id=?", [
                    json.id
                ], (err, ret) => err? cb(err):cb(null, ret)); break;
        }
    }

    list(obj, cb){
        switch(obj){
            case 'list':
                let _list_ = (total) => {
                    this.query("select * from list order by _upDate", 
                                    [], (err, ret) => err ? cb(err) : cb(null, {total, ret}));
                }
                this.query("select count(*) total from list ", [], 
                            (err, ret) => err ? cb(err) 
                                              : ret[0].total ? _list_(ret[0].total) 
                                                             : cb(null, {total: 0, ret: []}));
                break;
        }
    }

}

module.exports = Dbo;
