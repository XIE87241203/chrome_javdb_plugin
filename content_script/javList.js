
//
///**
// * 在document上代理mouseover事件
// */
//document.addEventListener('mouseover',function(e){
//    //移动到图片元素上时、则显示信息
//    if(e.target.tagName=='DIV'&& e.target.className =='box'){
//        var elements = e.target.getElementsByClassName('video-title');
//        if(elements.length>0){
//            var videoNum = elements[0].getElementsByTagName('strong');
//            if(videoNum.length>0){
//              console.log(videoNum[0].innerText);
//            }
//        }
//    }
//},true)


addOutPutVideoNumBtn()
const lastVideoNumsStorageTag = 'lastVideoNums';

function getPageVideoNum(isFirstPage, isLastPage){
    var elements = document.getElementsByClassName('video-title');
    var videoNums = new Array();
    for(var i=0; i<elements.length; i++){
        var videoNum = elements[i].getElementsByTagName('strong');
        if(videoNum.length>0){
            videoNums.push(videoNum[0].innerText);
        }
    }
    videoNums.sort();

    if(isFirstPage){
        //第一页清空历史记录
        setStorage(lastVideoNumsStorageTag, '');
    }
    var currentPageNums = videoNums.toString().replaceAll(',','\n');
    var lastVideoNums = getStorage(lastVideoNumsStorageTag);

    if(!lastVideoNums.includes(currentPageNums)){
        lastVideoNums = lastVideoNums + '\n' + currentPageNums;
    }
    //将号码发送到粘贴板
    navigator.clipboard.writeText(lastVideoNums)
        .catch((error) => { alert(`导出失败! ${error}`) });

    if(!isLastPage){
        //不是最后一页，保存此页号码
        setStorage(lastVideoNumsStorageTag,lastVideoNums);
    }else{
        //最后一页页清空历史记录
        setStorage(lastVideoNumsStorageTag, '');
    }
}

function getStorage(tag){
    return localStorage.getItem(tag);
}

function setStorage(tag,info){
    localStorage.setItem(tag,info);
}

function isFistPage(){
    //根据url有没有page参数判断是否是第一页
    var url = document.URL;
    var searchParams = new URLSearchParams(url);
    return !searchParams.has('page');
}

function addOutPutVideoNumBtn(){
    var pageTitle = document.getElementsByClassName('search-panel field has-addons');
    if(pageTitle.length ==0) return;
    var myDev =  document.createElement("div");
    myDev.setAttribute("class", "control has-left-sep");
    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.textContent = "导出本页番号"
    button.setAttribute("id", "btn_output_video_num");
    button.setAttribute("class", "button is-medium is-info");
    myDev.appendChild(button);
    pageTitle[0].appendChild(myDev);

    var nextBtn = document.getElementsByClassName('pagination-next');

    var myBtn = document.getElementById('btn_output_video_num');
    myBtn.addEventListener('click', () => {
        if(nextBtn.length !=0 ){
            //自动点击下一页
            nextBtn[0].click();
        }
        getPageVideoNum(isFistPage());
      });
}





