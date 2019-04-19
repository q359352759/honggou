
import { 百度转标转WGS84 , bd09togcj02 } from "@/assets/js/地图坐标转换.js";

import { bd_decrypt } from "@/assets/js/currency";

const 跳转地图=(起点位置,终点位置,终点名,终点说明)=>{
    if(ApplicationType=='app'){
        function plusready完成(){
            // 设置目标位置坐标点和其实位置坐标点
            if(AppType=='ios'){
                var 起点=bd09togcj02(起点位置.x, 起点位置.y);
                var 终点=bd09togcj02(终点位置.x,终点位置.y);
                var dst = new plus.maps.Point(起点[0] , 起点[1]);
                var src = new plus.maps.Point(终点[0] , 终点[1]);
                // 调用系统地图显示 
                plus.maps.openSysMap(src, 终点名 , dst);
            }else{
                var 起点=百度转标转WGS84(起点位置.x, 起点位置.y);
                var 终点=百度转标转WGS84(终点位置.x,终点位置.y);
                var dst = new plus.maps.Point(起点[0] , 起点[1]);
                var src = new plus.maps.Point(终点[0] , 终点[1]);
                // 调用系统地图显示 
                plus.maps.openSysMap(src, 终点名 , dst);
            }
        }
        if (window.plus) {
            plusready完成();
        } else {
            document.addEventListener('plusready', plusready完成, false);
        }
    }else{
        console.log('微信地图')
        var ditu = bd_decrypt(终点位置.x, 终点位置.y);
        wx.openLocation({
            latitude: ditu.lat, // 纬度，浮点数，范围为90 ~ -90
            longitude: ditu.lng, // 经度，浮点数，范围为180 ~ -180。
            name: 终点名, // 位置名
            address: 终点说明, // 地址详情说明
            scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: "" // 在查看位置界面底部显示的超链接,可点击跳转
        });
    }
}

export{
    跳转地图
}