
export default {
    namespaced: true,
    state: {
        显示更新弹出框:false,
        下载进度:0,
        下载完成:false,
        apk路径:'',
    },
    getters: {
        安卓app更新(state){
            return state
        },
    },
    mutations: {},
    actions: {
        初始化app更新状态({state,dispatch}){
            state.下载进度=0
            state.下载完成=false
            state.显示更新弹出框=true;

            dispatch('开始下载app')
        },
        async 开始下载app({state , dispatch}){
            state.下载完成=false;
            state.下载进度=0
            await dispatch('删除旧apk');
            if (window.plus) {
                开始下载();
            } else {
                document.addEventListener('plusready', 开始下载, false);
            }
            function 开始下载(){
                var url='http://m.lxad.vip/test/honggou.apk';
				console.log(url);
				var options = {method:"GET"};
				var dtask = plus.downloader.createDownload( url, options );
				dtask.addEventListener( "statechanged", function(task,status){
					if(!dtask){return;}
					switch(task.state) {
						case 1: // 开始
							console.log( "开始下载..." );
						break;
						case 2: // 已连接到服务器
							console.log( "链接到服务器..." );
						break;
						case 3:	// 已接收到数据
							// console.log( "下载数据更新:" );
							// console.log( task.downloadedSize+"/"+task.totalSize );
                            // console.log(Math.floor((task.downloadedSize / task.totalSize)*100) );
                            state.下载进度=Math.floor((task.downloadedSize / task.totalSize)*100)
						break;
						case 4:	// 下载完成
                            console.log("下载完成！"+task.filename)
                            state.下载完成=true;
                            state.apk路径=task.filename
						break;
					}
				});
				dtask.start();
            }
        },
        安装({state}){
            console.log('点击了安装');
            if(state.下载完成){
                plus.runtime.openFile( state.apk路径, {}, function ( e ) {
                    plus.nativeUI.alert( "app安装错误：请前往公众号下载"+e.message );
                });
            }
        },
        删除旧apk(){
            // 这是API文档里面写的很清楚的，获取文件entry，entry是文件操作接口  
            return new Promise((resolve, reject) => {
                if (window.plus) {
                    删除();
                } else {
                    document.addEventListener('plusready', 删除, false);
                }
                function 删除(){
                    var 相对路径名称="_downloads/honggou.apk";
                    plus.io.resolveLocalFileSystemURL(相对路径名称, function( entry ) {  
                        entry.remove( function ( e ) {  
                            console.log( "删除成功" );  
                            resolve()
                        }, function ( e ) {  
                            console.log("删除失败",e);
                            resolve()
                        });  
                    },function(err){
                        console.log(JSON.stringify(err));
                        resolve()
                    });  
                }
            });
        }
    },
    modules: {
    }
};

// store.commit( 'hongbao/...');
