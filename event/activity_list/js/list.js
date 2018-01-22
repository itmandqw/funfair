angular.module("listApp",[])
.controller("listCtrl",["$scope","$http","$location",function($scope,$http,$location){
    var params = $location.search();
    $scope.isLogin = false;

    $scope.List=[];
    if(params.token){
        $scope.isLogin = true;
        $scope.err = false;
        $http.get("/gkiwi/svc/v2.0/event/events",{
        // $http.get("./activity_list/js/imgsrc.json",{
            headers: {
                        // "Authorization": 'Bearer ' + token,
                        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLjE4MjgiLCJyb2xlcyI6WyIiXSwiaWF0IjoxNTE2NTkxMzkzLCJqdGkiOiJ1c2VyX3Rva2VuLjEwMDEwNTMiLCJleHAiOjE1MTkxODMzOTN9.oUt9FWi40lFdit7BOb7MxoRzQWZzG0MUwbQNAr8nNcg",
                        "Content-Type": "json"
            }
        }).then(function(data){
            var list = data.data;
            var acting = [];
            console.log(list)
            for(var i =0;i<list.length;i++){
                var id = list[i];
                console.log(id);
                //通过id获取活动的相关资料
                $http.get("/gkiwi/svc/v2.0/event/" + id,{
                    headers: {
                        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLjE4MjgiLCJyb2xlcyI6WyIiXSwiaWF0IjoxNTE2NTkxMzkzLCJqdGkiOiJ1c2VyX3Rva2VuLjEwMDEwNTMiLCJleHAiOjE1MTkxODMzOTN9.oUt9FWi40lFdit7BOb7MxoRzQWZzG0MUwbQNAr8nNcg",
                        "Content-Type": "json"
                    }
                }).then(function(data){
                    var temp = data.data.picture;
                    console.log(temp);
                    acting.push(temp);
                    console.log(acting);
                    $scope.join_act(id);


                },function(err){
                    $scope.err = true;
                })
                $scope.acting = acting;

            }

        },function(err){
            console.log("网络请求错误");
            $scope.err = true;
        })
    }else{
        $scope.isLogin = false;
        console.log("请先在APP中登录");
    }
    $scope.close1 = function(){
        window.location.href = "about:blank";
        window.close();
    }

    $scope.join_act = function(e){
        // window.location.href = "./" + id + "/intro/?token=" + token;
        console.log(e)
    }
}])
.config(["$locationProvider",function($locationProvider){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    })
}])