var url = window.location.href;
console.log(url)
if(url.indexOf('?')!== -1){
    var params = url.split("?")[1];
    console.log(params);
    var obj = {};

    if(params.indexOf('&')!== -1){       //有多个参数(token和活动id)
        params = params.split('&');
        for (var x in params){
            var param = params[x].split('=');
            obj[param[0]] = param[1];
        }
        console.log(obj);
        var id = obj.id;
        var token = obj.token;
        var OS = obj.OS;
        console.log(token);
        if(obj.id&&obj.token){
          // 只要存在活动id就直接跳转到具体的活动页面==========================================
            window.location.href = './' + id + '/intro' + "/?token=" + token + "&id=" + id;
        }
    }
}


