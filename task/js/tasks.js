angular.module('myApp',[])
  .controller('TaskCtrl',['$scope','$http','$location', function ($scope,$http,$location) {
      //用户进来就显示每项任务的积分，以及用户个人的完成情况
      // token随着请求我页面的URL一起来的，需要我获取到这个token,在当前页面的URL中
      var params = $location.search();
      console.log(params);
      if(!params.token){
          document.getElementById('attention').style.display = "block";
          preventBtn();
          console.log('没有登录')
      }else{
          var token = params.token;
          console.log(token);
          $scope.score={};
          $scope.status={};
          //获取每项任务的分数
          $http.get('/gkiwi/svc/v2.0/user/task_score',{
              headers : {"Authorization" :'Bearer '+ token,
                  "Content-Type": "json"
              }
          }).then(function(result){
              if(result.status == 200){
                  console.log(result)
                  var res = result.data;
                  $scope.score = res;
              }
          },function(err){
              console.log(err.status);
              document.getElementById("wrong").style.display = "block";
              preventBtn();
          })

          //获取当前用户的个人任务完成状态
          $http.get('/gkiwi/svc/v2.0/user/task_status',{
              headers: {"Authorization" :'Bearer '+token,
                  "Content-Type": "json"
              }
          }).then(function(result){
              if(result.status == 200){
                  console.log(result)
                  var res = result.data[0];
                  $scope.status = res;
              }
          },function(err){
              console.log(err.status);
              document.getElementById("wrong").style.display = "block";
              preventBtn();
          })

          // 每日任务
          //1，签到
          $scope.signIn = function () {
              $http.post('/gkiwi/svc/v2.0/user/check_in',undefined,{
                  headers : {"Authorization" :'Bearer '+ token,
                      "Content-Type": "json"
                  }
              }).then(function(data) {
                  console.log("check_in_status:",data.status)
                  if(data.status == 200){
                      document.getElementById('myModal').style.display = 'block';
                      preventBtn();
                      console.log('签到成功');
                      $scope.status.checkin = true;
                  }
              },function (err) {
                  console.log(err.status);
                  document.getElementById('fail').style.display = 'block';
                  preventBtn();
              })
          }
      }

      //4,创建一篇足迹
      $scope.createMood = function(){
          app.createMood();
      }

      //1，完善个人信息
      $scope.finishProfile = function(){
          app.finishUserInfo();
      }
      //2，绑定微信
      $scope.bindWeixin = function(){
          app.bindWeixin();
      }
      // 积分兑换
      $scope.exchanging = function(){
          app.exchanging();
      }

      $scope.close1 = function(){
          document.getElementById('myModal').style.display = 'none';
          releaseBtn();
      }
      $scope.close3 = function(){
          document.getElementById('fail').style.display = 'none';
          releaseBtn();
      }

      $scope.close2 = function(){
          window.location.href="about:blank";
          window.close();
      }
      $scope.close4 = function(){
          window.location.href="about:blank";
          window.close();
      }
  }])
    .config(['$locationProvider',function($locationProvider){
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        })
    }])
function preventBtn(){
    var btns = document.getElementsByTagName("button");
    for(var i=0;i<btns.length;i++){
        btns[i].disabled = true;
    }
}
function releaseBtn(){
    var btns = document.getElementsByTagName("button");
    for(var i=0;i<btns.length;i++){
        btns[i].disabled = false;
    }
}