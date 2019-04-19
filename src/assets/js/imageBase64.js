function 本地图片转base64(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS');
　　var ctx = canvas.getContext('2d')
　　var img = new Image;
    console.log(canvas)
　　img.crossOrigin = 'Anonymous';
　　img.onload = function(){
    　　canvas.height = img.height;
    　　canvas.width = img.width;
    　　ctx.drawImage(img,0,0);
    　　var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    　　callback.call(this, dataURL);
    　　canvas = null; 
    };
　　img.src = url;
}

export {
    本地图片转base64
};