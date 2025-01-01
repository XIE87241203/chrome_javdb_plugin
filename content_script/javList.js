
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

function getPageVideoNum(){
    var elements = document.getElementsByClassName('video-title');
    var videoNums = new Array();
    for(var i=0; i<elements.length; i++){
        var videoNum = elements[i].getElementsByTagName('strong');
        if(videoNum.length>0){
            videoNums.push(videoNum[0].innerText)
        }
    }
    videoNums.sort();
    navigator.clipboard.writeText(videoNums.toString().replaceAll(',','\n'))
      .catch((error) => { alert(`导出失败! ${error}`) });
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

    var myBtn = document.getElementById('btn_output_video_num');
    myBtn.addEventListener('click', () => {
        getPageVideoNum();
      });
}
