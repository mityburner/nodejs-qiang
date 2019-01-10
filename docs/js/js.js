window.onload = function(){
    document.querySelector('#add').addEventListener('click', onAdd, false);
    init();
    list('list');
}
function init(){
    document.querySelector('.input[name=domain]').value = '';
}
function onAdd(){
    var domain = document.querySelector('.input[name=domain]').value;
    var obj = 'list';
    var json = {domain: domain};
    ajax('add', {obj: obj, json: json}, function(code,data) {
        switch(code){
            case '1000':
                list(obj);
            break;
            case '1002':
                alert(data);
            break;
            default: 
                alert("添加失败");
            break;
        }
    });
}
function onDel(obj, id){
    ajax('delete', {obj: obj, json: {id: id}}, function(code, data){
        console.log(code,data);
        switch(code){
            case '1000': 
                init();
                list(obj);
            break;
            default: alert('删除失败');
            break;
        }
    });
}
function list(obj){
    var head = {},
        table = document.querySelector('.table');
    switch(obj){
        case 'list':
            head.domain = '域名';
            head._clID = '原clID';
            head._crDate = '创建日期';
            head._upDate = '更新日期';
            head._exDate = '到期日期';
            head.clID_ = '新clID';
            head.crDate_ = '新创建日期';
            head.exDate_ = '新到期日期';
            head.password = '口令';
            head.op = '操作';
        break;
    }
    
    var t = '';
    Object.keys(head).forEach(function(key){
        t += "<th>" + head[key] + "</th>"
    });
    table.querySelector('thead').innerHTML = "<tr>"+ t +"</tr>";
    ajax('list', {obj: obj}, function(code, data){
        console.log(code, data);
        switch(code){
            case '1000': 
                var html = '';
                data.ret.forEach(function(row){
                    var tr = '';
                    Object.keys(head).forEach(function(key){
                        switch(key){
                            case 'op':
                                tr += "<td>" + isView(obj, row['password'], row['id']) + "</td>";
                            break;
                            case '_crDate':
                            case '_upDate':
                            case '_exDate':
                            case 'crDate_':
                            case 'exDate_':
                                tr += "<td>" + (row[key]? formatDateTime(new Date(row[key])):'')  + "</td>";
                            break;
                            default:
                                tr += "<td>" + (row[key]? row[key]:'')  + "</td>";
                            break;
                        }
                    });
                    html += "<tr>"+ tr +"</tr>";
                });
                table.querySelector('tbody').innerHTML = html;
            break;
            default: alert('数据抓取失败');
            break;
        }
    });
}
function isView(obj, password, id){
    return password ? '':'<input type="button" class="button danger" value="删除" onclick="onDel(\'' + obj + '\', ' + id + ')">';
}
function convertDate(date){

}
function ajax(command, pair, cb) {
    var xhr = new XMLHttpRequest();
    // Fix Begin -- IE's Bug
    var state = 0;
    // Fix End -- IE's Bug
    xhr.onreadystatechange = function(e) {
        // Fix Begin -- IE's Bug
        if(state === this.readyState) return;
        state = this.readyState;
        // Fix End -- IE's Bug
        switch(this.readyState) {
        case 4:
            (this.status===200) ? cb(this.response.code, this.response.data) : cb();
        }
    };
    xhr.open('POST', command, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(pair));
    xhr.responseType = 'json';
}
function formatDateTime(datetime) {
    var now = datetime || new Date(),
        year = now.getFullYear(),
        month = now.getMonth()+1,
        date = now.getDate(),
        HH = now.getHours(),
        MM = now.getMinutes(),
        SS = now.getSeconds();
    return year + '-' + (month < 10 ? '0'+month : month)
                + '-' + (date < 10 ? '0'+date : date)
                + ' ' + (HH < 10 ? '0'+HH : HH)
                + ':' + (MM < 10 ? '0'+MM : MM)
                + ':' + (SS < 10 ? '0'+SS : SS);
}