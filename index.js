const cgi = require('nodejs-cgi');
const http = require('http');
const punycode = require('punycode');
const {mysql} = require('./lib/config.js');
const Dbo = require('./db/dbo.js');
const dbo = new Dbo(mysql);


function _output(res, json) {
    res.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
    res.end(JSON.stringify(json));
}

function api_add(req, res){
    let {domain} = req.body.json;
        domain = punycode.toASCII(domain).toLowerCase();
    dbo.isExist(req.body.obj, {domain}, (err, total) => {
        if(err) return _output(res, {code: '1001'});
        if(total) return _output(res,{code: '1002', data: "域名已存在"});
        dbo.add(req.body.obj, {domain}, (err, data) => {
            _output(res, { code: err ? '1003' : '1000'});
        });
    });
}

function api_delete(req, res){
    dbo.delete(req.body.obj, req.body.json, (err, data) => {
        _output(res, { code: err ? '1001' : '1000' });
    });
}

function api_list(req,res){
    dbo.list(req.body.obj, (err, data) => {
        _output(res, { code: err ? '1001' : '1000', data });
    });
}

var map = {
    bin: {
        '/add': api_add,
        '/delete': api_delete,
        '/list': api_list
    },
    exp: {
    },
    doc: 'docs',
    ext: '.html'
};

http.createServer(cgi.route(map)).listen(3000,'127.0.0.1');
