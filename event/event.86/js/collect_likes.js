//请求获得后台的开始时间，以及结束时间
var begin = "";        //开始时间
var end = "";          //结束时间

angular.module("collectLikes",[])
    .controller("collectLikesCtrl",["$location","$scope","$http","$timeout",function($location,$scope,$http,$timeout){
        $scope.isLogin = true;    //用户登录状态
        $scope.timing = false;     //活动进行状态
        $scope.err = false;        //初始状态
        $scope.timebefore = false; //倒计时显示状态
        $scope.win = false;        //活动结束，用户获奖状态

        var params = $location.search();
        console.log(params)
        if(!params.token){

            $scope.isLogin = false;
            $("#prompt").css("display","block");
        }else{

            $scope.isLogin = true;
            var token = params.token;

            var time = getBeginEndTime(token); //获取到开始结束时间
            begin = time.begins;
            end = time.ends;
            console.log("下面能用的",begin,end)

            var obj = countTime(begin,end);
            console.log(obj);
            if(obj.count <= 0){                    //活动已经结束,根据后台数据显示用户活动期间表现
                console.log("用户已经登录，并且活动已经结束！",obj)
                $http.post("../js/result.json",undefined,{
                    header:{
                        "Authorization": "Bearer  "+ token,
                        "Content-Type":"json"
                    }
                }).then(function(data){
                    if(data.data.success){
                        $scope.win = true;
                        $scope.num = data.data.num;
                        $scope.prize = data.data.prize;
                    }
                },function(err){
                    $("#busy").css("display","block");
                })
            }
            if(obj.earlyCount > 0){                          //活动还未开始，显示活动倒计时/活动未开始页面
                $scope.timebefore = true;
                // window.location.href = "../../../bs/common/not_start.html";
            }
            if(obj.earlyCount<=0 && obj.count > 0){          //活动正在进行，设置活动进行状态为true
                $scope.timing = true;
            }
        }
        $scope.close1 = function(){
            window.location.href = "about:blank";
            window.close();
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


//显示倒计时
$(function(){
    console.log("页面加载完毕的",begin,end)
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



//时间判断功能型函数
function checkTime(time){
    if(time<10){
        return "0"+ time;
    }
    return time;
}

function countTime(beginTime,endTime){
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


function getBeginEndTime(token){
    $.ajax({
        type: "GET",
        headers: {
            "Authorization":"Bearer " + token
        },
        async: false,
        url: "../js/detail.json",
        dataType: "json",
        success: function(data){
            console.log(data)
            begin = data.startTime;
            end = data.endTime;
        }
    });
    console.log("内部",begin,end)
    return {
        "begins": begin,
        "ends": end
    }
}


