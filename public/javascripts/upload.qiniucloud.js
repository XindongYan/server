function qiniuUpload(container, browse_button, init) {
  var uploader1 = Qiniu.uploader({
    runtimes: 'html5,flash,html4',    //上传模式,依次退化
    browse_button: browse_button,       //上传选择的点选按钮，**必需**
    uptoken_url: '/api/qiniucloud/uptoken',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
    // uptoken : '<Your upload token>', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
    unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
    // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
    domain: 'http://oyufgm5i2.bkt.clouddn.com',   //bucket 域名，下载资源时用到，**必需**
    container: container,           //上传区域DOM ID，默认是browser_button的父元素，
    max_file_size: '100mb',           //最大文件体积限制
    // flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
    max_retries: 3,                   //上传失败最大重试次数
    dragdrop: true,                   //开启可拖曳上传
    drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
    chunk_size: '4mb',                //分块上传时，每片的体积
    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
    init: init,
    // init: {
    //     'FilesAdded': function(up, files) {
    //         plupload.each(files, function(file) {
    //             // 文件添加进队列后,处理相关的事情
    //         });
    //     },
    //     'BeforeUpload': function(up, file) {
    //     },
    //     'UploadProgress': function(up, file) {
    //         var size = plupload.formatSize(file.size).toUpperCase();
    //         var loaded = plupload.formatSize(file.loaded).toUpperCase();
    //         var formatSpeed = plupload.formatSize(file.speed).toUpperCase();
    //         var percent = file.percent;
    //         if(file.percent == 100) percent = 99;
    //         $('#pickfiles1').text(percent + "%");
    //     },
    //     'FileUploaded': function(up, file, info) {
    //            // 每个文件上传成功后,处理相关的事情
    //            // 其中 info 是文件上传成功后，服务端返回的json，形式如
    //            // {
    //            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
    //            //    "key": "gogopher.jpg"
    //            //  }
    //            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

    //            var domain = up.getOption('domain');
    //            var res = JSON.parse(info);
    //            var sourceLink = domain + res.key;
    //            console.log(sourceLink)
    //            pic1 = sourceLink;
    //            $('#pickfiles1').text("100%");
    //     },
    //     'Error': function(up, err, errTip) {
    //            //上传出错时,处理相关的事情
    //     },
    //     'UploadComplete': function() {
    //            //队列文件处理完毕后,处理相关的事情
    //     },
    //     'Key': function(up, file) {
    //         // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
    //         // 该配置必须要在 unique_names: false , save_key: false 时才生效

    //         var key = "";
    //         // do something with key here
    //         return key
    //     }
    // }
  });
}

function qiniuUploadImg(file, extname, success, error) {
    $.get('/api/qiniucloud/uptoken', function(result) {
        $.ajax({
            url: 'http://up.qiniu.com/putb64/-1/key/' + $.base64.encode('croppered-' + String(Date.now()) + extname),
            method: 'POST',
            headers: {
                Authorization: "UpToken " + result.uptoken
            },
            data: file,
            contentType: false, // 注意这里应设为false
            processData: false,
            cache: false,
            success: function(data) {
                success({
                    key: data.key,
                    hash: data.hash,
                    url: 'http://oyufgm5i2.bkt.clouddn.com' + '/' + data.key
                });
            },
            error: error
        });
    });
}