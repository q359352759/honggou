
export default {
    namespaced: true,
    state: {
    },
    getters: {

    },
    mutations: {},
    actions: {
        保存图片到相册({},base64Str){
            return new Promise((resolve, reject) => {
                function plusReady(){
                    var bitmap = new plus.nativeObj.Bitmap("test");  
                        bitmap.loadBase64Data(base64Str, function(){
                            console.log("加载Base64图片数据成功");
                            var name =  '_doc/'+(new Date()).getTime()+'.png';
                                console.log('图片名称：'+name);
                            bitmap.save(name,{format:'png'},function(i){
                                plus.gallery.save(name, function(e){
                                    console.log('保存相册成功：'+JSON.stringify(e));
                                    var main = plus.android.runtimeMainActivity();   
                                    var intent= plus.android.importClass('android.content.Intent');  
                                    var Uri= plus.android.importClass('android.net.Uri');  
                                        main.sendBroadcast(new intent(intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.parse(name)));
                                })
                                bitmap.recycle();
                                console.log('保存图片成功：'+JSON.stringify(i));
                                resolve()
                            },function(e){
                                bitmap.recycle();
                                console.log('保存图片失败：'+JSON.stringify(e));
                                resolve() 
                            });  
                        }, function(){
                            console.log('加载Base64图片数据失败：'+JSON.stringify(e));
                            bitmap.recycle();
                            resolve();
                        });
                } 
                if(window.plus){  
                    plusReady();
                }else{  
                    document.addEventListener("plusready",plusReady,false);  
                }
            });
        }
    },
    modules: {
    }
};

// store.commit( 'hongbao/...');
