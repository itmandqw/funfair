angular.module("listApp",[])
.controller("listCtrl",["$scope","$http","$location",function($scope,$http,$location){

    $http.get("./activity_list/js/imgsrc.json")
        .then(function(data){
        var src = data.data.lists;
        console.log(src);
        $scope.imginfo = src;
            $scope.join_act = function(){
                var self = this;
                var id = self.src.id;
                console.log(self.src.id);

                var href1 = "";
                var params = $location.search();
                if(params.token){
                    var token = params.token;
                    href1 = "./"+ id + "/intro/?token=" + token;
                    console.log(href1);
                }else{
                    href1 = "./"+ id + "/intro";
                }

                window.location.href = href1;
            }
    },function(err){
            console.log(err.message);
        })
}])
.config(["$locationProvider",function($locationProvider){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    })
}])