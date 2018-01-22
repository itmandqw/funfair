$(document).ready(function(){
    getChance();
    $('#tip').click(function(){
        if(rotate.flag_click){
            rotate.calculate_result();
        }
    });
});


var rotate = {
      rotate_angle : 0, //起始位置为0
      flag_click : true, //保证转盘转动过程中不可再次点击
      calculate_result:function(){

          /*1, 获取抽奖机会值(一进入页面就去请求)*/
          getChance();
          var chance = $(".coud_num").html();
          console.log(chance);
          if(parseInt(chance) <= 0){
              // $("#tip").attr("src","images/timeout3X.png");
              $('#apply5').modal('show');
              return false;
          }else{
              var self = this;
              var integral = 0;
              // 用户点击转盘转动时，向后台请求中奖数据，根据这个数据来定位轮盘的位置
              $.ajax({
                  // url: 'https://dev.youbanban.com/gkiwi/svc/v2.0/draw',
                  url:'../js/choujiang.json',
                  type: 'GET',
                  // headers:{
                  //     "Authorization":"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLjE4NzEiLCJyb2xlcyI6WyIiXSwiaWF0IjoxNTExNDI2NDA4LCJqdGkiOiJ1c2VyX3Rva2VuLjIwMDUwIiwiZXhwIjoxNTE0MDE4NDA4fQ._ylw6dhM8fi8tOMJ_no9UKqwGH124lyQ2geZBbAn-uo"
                  // },
                  dataType: 'json',
                  success: function(data){
                      console.log(data);
                      integral = data.number; //中奖的积分数0/500/1000/2000
                      console.log(integral);
                      switch(integral){
                          case '0': self.rotate_angle = 0 + 4 * 360; break;
                          case '1000': self.rotate_angle = 60 +  4 * 360; break;
                          case '500': self.rotate_angle = 120 +  4 * 360; break;
                          case '2000': self.rotate_angle = 180 +  4 * 360; break;
                      }
                      console.log(self.rotate_angle);
                      zhuanpanRotate();
                  }
              })

              function zhuanpanRotate(){
                  // 旋转结束前，不允许再次触发
                  self.flag_click = false;
                  $('#img').css({
                      'transform': 'rotate('+self.rotate_angle +'deg)',
                      '-ms-transform': 'rotate('+self.rotate_angle+'deg)',
                      '-webkit-transform': 'rotate('+self.rotate_angle+'deg)',
                      '-moz-transform': 'rotate('+self.rotate_angle+'deg)',
                      '-o-transform': 'rotate('+self.rotate_angle+'deg)',
                      'transition': 'transform ease '+'3s',
                      '-moz-transition': '-moz-transform ease '+'3s',
                      '-webkit-transition': '-webkit-transform ease '+'3s',
                      '-o-transition': '-o-transform ease '+'3s'
                  });
              }

              setTimeout(function(){
                  // 旋转结束后，允许再次触发
                  self.flag_click = true;
                  // 根据抽奖的奖项提示用户并获取到用户抽得的积分
                  if(integral=="500")
                  {
                      $('#apply1').modal('show');
                  }else if(integral=="1000"){
                      $('#apply2').modal('show');
                  }else if(integral=="2000"){
                      $('#apply3').modal('show');
                  }else{
                      $('#apply4').modal('show');
                  }
              },3500);
          }
          getChance();
      }
    }


// 返回按钮关闭页面
$('.back').click(function(){
    window.close();
})

/* 获取抽奖机会值(一进入页面就去请求)*/
function getChance(){
    $.ajax({
        // url: 'https://dev.youbanban.com/gkiwi/svc/v2.0/chance',
        url: '../js/chance.json',
        type: 'GET',
        // headers:{
        //     "Authorization":"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLjE4NzEiLCJyb2xlcyI6WyIiXSwiaWF0IjoxNTExNDI2NDA4LCJqdGkiOiJ1c2VyX3Rva2VuLjIwMDUwIiwiZXhwIjoxNTE0MDE4NDA4fQ._ylw6dhM8fi8tOMJ_no9UKqwGH124lyQ2geZBbAn-uo"
        // },
        dataType: 'json',
        success: function(data){
            var chance = data.number;
            $(".coud_num").html(chance);
        }
    });
}
