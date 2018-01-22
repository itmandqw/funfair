// 获取时间的倒计时
var begin = "2018/2/15 00:00:00";                  //设置活动开始时间
var end = "2018/2/23 00:00:00";                    //设置活动结束时间

$(function(){
    var countObj = countTime(begin,end);
    var earlyCount = countObj.earlyCount;
    translateDate(earlyCount);

})

var timer = setInterval(function(){
    var countObj = countTime(begin,end);
    var earlyCount = countObj.earlyCount;
    if(earlyCount<=0){
        clearInterval(timer);
    }
    translateDate(earlyCount);
},1000)


angular.module("collectLikes",[])
    .controller("collectLikesCtrl",["$location","$scope","$http",function($location,$scope,$http){
        $scope.isLogin = false;    //用户登录状态
        $scope.timing = false;     //活动进行状态
        var obj = countTime(begin,end);
        console.log(obj);
        if(obj.earlyCount > 0){                          //活动还未开始，显示活动倒计时/活动未开始页面
            $("#timing").css("display","block");
        }
        if(obj.earlyCount<=0 && obj.count > 0){          //活动正在进行，设置活动进行状态为true
            $scope.timing = true;
        }

        var params = $location.search();
        console.log(params)
        if(!params.token){
            $scope.isLogin = false;
            $('#prompt').css("display","block");
        }else{
            $scope.isLogin = true;
            var token = params.token;
            if(obj.count <= 0){                    //活动已经结束,根据后台数据显示用户活动期间表现
                console.log("用户已经登录，并且活动已经结束！",obj)
                $http.post("../js/result.json",{
                    header:{
                        "Authorization": "Bearer  "+ token,
                        "Content-Type":"json"
                    }
                }).then(function(data){
                    if(data.data.success){
                        $("#win").css("display","block");
                        $scope.num = data.data.num;
                        $scope.prize = data.data.prize;
                    }
                },function(err){
                    $('#busy').css("display","block");
                })
            }
        }
        $scope.back = function(){
            window.location.href = "about:blank";
            window.close();
        }
        $scope.close1 = function(){
            $('#prompt').css("display","none");
        }
        $scope.close2 = function(){
            $('#busy').css("display","none");
        }
        $scope.creat_mood = function(){
            console.log("创建足迹")
            app.createMood();
        }
    }])
    .config(['$locationProvider',function($locationProvider){
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        })
    }])


//时间判断功能型函数
function checkTime(time){
    if(time<10){
        return "0"+ time;
    }
    return time;
}

function countTime(beginTm,endTm){
    var beginTime = new Date(beginTm).getTime();
    var endTime = new Date(endTm).getTime();
    var nowTime = new Date().getTime();
    // 获取距离结束时间相差的秒数
    var count = (endTime - nowTime)/1000;
    var earlyCount = (beginTime - nowTime)/1000;

    return {
        "count":count,
        "earlyCount":earlyCount
    }
}

function translateDate(count){
    // 获取倒计时天数，小时，分钟，并转化格式
    var days = parseInt(count/(60*60*24));
    days = checkTime(days);
    var hours = parseInt(count/(60*60)%24);
    hours = checkTime(hours);
    var minutes = parseInt(count/(60)%60);
    minutes = checkTime(minutes);

    console.log(days,hours,minutes)

    $("#days").html(days);
    $("#hours").html(hours);
    $("#mins").html(minutes);
}



