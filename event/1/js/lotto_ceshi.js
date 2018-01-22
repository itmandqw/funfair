//获取用户当前积分
var integral = 0;
// $.ajax({
//     type: 'post',
//     url: '',
//     dataType: 'json',
//     success: function(data){
//         console.log(data)
//     }
// })

/* 获取抽奖机会值*/
var nun1=$(".coud_num").html();
// 转盘样式，a：旋转角度，p：概率（1代表100%），t：需要显示的其它信息（文案or分享）
var a,p,t;
var result_angle = [
    {a:0,p:0.25,t:'谢谢'},
    {a:60,p:0.15,t:'1000积分'},
    {a:120,p:0.125,t:'500积分'},
    {a:180,p:0.1,t:'2000积分'},
    {a:240,p:0.25,t:'谢谢'},
    {a:300,p:0.125,t:'500积分'}
];
var rotate = {
    rotate_angle : 0, //起始位置为0
    flag_click : true, //转盘转动过程中不可再次触发
    calculate_result:function(during_time){//during_time:持续时间(s)
        var self = this;

        during_time = during_time || 1; // 默认为1s

        var rand_num = Math.ceil(Math.random() * 100); // 用来判断的随机数，1-100

        var result_index; // 最终要旋转到哪一块，对应result_angle的下标
        var start_pos = end_pos = 0; // 判断的角度值起始位置和结束位置

        for(var i in result_angle){
            start_pos = end_pos + 1; // 区块的起始值
            end_pos = end_pos + 100 * result_angle[i].p; // 区块的结束值

            if(rand_num >= start_pos && rand_num <= end_pos){ // 如果随机数落在当前区块，那么获取到最终要旋转到哪一块
                result_index = i;
                break;
            }
        }

        var rand_circle = Math.ceil(Math.random() * 2) + 1; // 附加多转几圈，2-3

        self.flag_click = false; // 旋转结束前，不允许再次触发
        self.rotate_angle = self.rotate_angle - rand_circle * 360 - result_angle[result_index].a - self.rotate_angle % 360;
        $('#img').css({
            'transform': 'rotate('+self.rotate_angle+'deg)',
            '-ms-transform': 'rotate('+self.rotate_angle+'deg)',
            '-webkit-transform': 'rotate('+self.rotate_angle+'deg)',
            '-moz-transform': 'rotate('+self.rotate_angle+'deg)',
            '-o-transform': 'rotate('+self.rotate_angle+'deg)',
            'transition': 'transform ease-out '+during_time+'s',
            '-moz-transition': '-moz-transform ease-out '+during_time+'s',
            '-webkit-transition': '-webkit-transform ease-out '+during_time+'s',
            '-o-transition': '-o-transform ease-out '+during_time+'s'
        });

        // 旋转结束后，允许再次触发
        setTimeout(function(){
            self.flag_click = true;
            // 告诉结果
            if(result_angle[result_index].t=="500积分")
            {
                $('#apply1').modal('show');
                integral += 500;
            }else if(result_angle[result_index].t=="1000积分"){
                $('#apply2').modal('show');
                integral += 1000;
            }else if(result_angle[result_index].t=="2000积分"){
                $('#apply3').modal('show');
                integral += 2000;
            }else{
                $('#apply4').modal('show');
            }
            console.log(integral);         //在此处获取到用户三次抽奖获取的积分总量
            //存入个人中心，也就是将抽奖积分与用户之前的积分相加

            nun1--;
            $(".coud_num").html(nun1);
            if(parseInt(nun1)<= 0){
                $("#tip").attr("src","images/timeout2X.png");
                return false;
            }

        },during_time*1000);
    }
}

$(document).ready(function(){

    $('#tip').click(function(){
        if(parseInt(nun1)<= 0){
            $("#tip").attr("src","images/timeout2X.png");
            return false;
        }
        if(rotate.flag_click){ // 旋转结束前，不允许再次触发
            rotate.calculate_result(1);
        }
    });
});
$('.back').click(function(){
    window.close();
})
$(".close1").click(function(){
    $('.padding1').modal('hide');
});
$(".close2").click(function(){
    $('#myModal').modal('hide');
});
