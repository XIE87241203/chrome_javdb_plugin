
const downloadInfo = getDownLoadInfos()
chrome.runtime.sendMessage({action:'download_info', data:downloadInfo});


//获取下载信息
function getDownLoadInfos(){
    var videoName = getVideoName();
    var linkDivListEle = document.getElementById('magnets-content');
    var downloadLinkInfoList = [];
    var hasChineseNum = 0
    for(var i=0; i<linkDivListEle.childElementCount; i++){
        var root = linkDivListEle.children[i];
        var link = root.getElementsByTagName('a')[0].getAttribute('href');
        var fileName = root.getElementsByClassName('name')[0].innerText;

        var size = "";
        var fileNum = "";
        if(root.getElementsByClassName('meta').length>0){
             var sizeAndNum = root.getElementsByClassName('meta')[0].innerText;
             //使用正则获取大小
             if(sizeAndNum.match(/[.|\d]*(GB|MB)/g) != null){
                size = sizeAndNum.match(/[.|\d]*(GB|MB)/g)[0];
             }
             //使用正则获取文件数
             if(sizeAndNum.match(/\d*個文件/g) != null){
                fileNum = sizeAndNum.match(/\d*個文件/g)[0].replace("個文件", "");
             }
        }

        //查询是否有字幕
        var hasChinese = false;
        var tagSpan = root.getElementsByClassName('tag is-warning is-small is-light');
        for(var j=0; j<tagSpan.length; j++){
            if(tagSpan[j].innerText == '字幕') {
                hasChinese = true;
                break;
            }
        }
        if(hasChinese) hasChineseNum = hasChinese + 1;
        var downloadLinkInfo = new DownloadLinkInfo(fileName, size, fileNum, link, hasChinese, 0);
        calDownloadInfoScore(downloadLinkInfo)
        downloadLinkInfoList.push(downloadLinkInfo);
    }
    //分数大的排上面
    downloadLinkInfoList.sort(function(a,b){
       return b.score - a.score;
    })

    if(hasChineseNum>1) videoName = videoName + "（多个字幕）"
    var downloadInfo = new DownloadInfo(videoName,downloadLinkInfoList)
    console.log(downloadInfo);
    return downloadInfo;
}

//获取视频名称
function getVideoName(){
    var elements = document.getElementsByClassName('button is-white copy-to-clipboard');
    if(elements.length>0){
        var name = elements[0].getAttribute('data-clipboard-text');
        return name;
    }
    return "null";
}


function DownloadInfo(videoName,linkInfos){
    //番号
    this.videoName = videoName;
    this.linkInfos = linkInfos;
}

function DownloadLinkInfo(fileName,size,fileNum,link,hasChinese,score){
    //文件名
    this.fileName = fileName;
    //大小
    this.size = size;
    //文件数
    this.fileNum = fileNum;
    //链接
    this.link = link;
    //是否有中文字幕
    this.hasChinese = hasChinese;
    //链接得分
    this.score = score;
}

  //根据属性计算得分
function calDownloadInfoScore(downInfo){
    var score = 0;
    //有字幕加10分
    if(downInfo.hasChinese){
        score = score + 10
    }
    //只有一个文件加1分
    if(downInfo.size < 2){
        score++
    }
    downInfo.score = score;
}
