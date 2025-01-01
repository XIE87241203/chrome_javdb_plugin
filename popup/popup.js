var downloadInfos = new Array();

//获取列表数据
chrome.runtime.sendMessage({action:'get_info'},(response) =>{
    downloadInfos = response.info;
    console.log('get_info', downloadInfos);
    initFrom();
})
//获取链接按钮
const getLinkBtn = document.getElementById('btn_get_download_link');
getLinkBtn.onclick = function(){
    let radioGroup = document.getElementById('download_info_form');
    let radioBtnList = radioGroup.getElementsByTagName('input');
    let links = new Array();
    for (let i = 0; i < radioBtnList.length; i++) {
        let item = radioBtnList[i]
        if(item.type == 'radio' && item.checked){
            links.push(item.value)
        }
    }
    console.log('getLinkBtn', links);
    //赋值到剪贴板
    navigator.clipboard.writeText(links.join('\n'))
          .catch((error) => { alert(`导出失败! ${error}`) });
}

//清除缓存按钮
const clearStorageBtn = document.getElementById('btn_clear_storage');
clearStorageBtn.onclick = function(){
    console.log('del_storage');
    clearForm();
    chrome.runtime.sendMessage({action:'del_storage'});
}

//关闭网页
const closePageBtn = document.getElementById('btn_close_page');
closePageBtn.onclick = function(){
    chrome.runtime.sendMessage({action:'close_page'});
}



function initFrom() {
    //创建表格
    let tableDiv = document.getElementById('download_info_div');
    let formElement = document.createElement('form');
    formElement.setAttribute('id', 'download_info_form');
    tableDiv.appendChild(formElement)
    for (let i = 0; i < downloadInfos.length; i++) {
        let groupParentDiv = document.createElement('div');
        formElement.appendChild(groupParentDiv);
        //添加按钮
        createRadioGroup(groupParentDiv,downloadInfos[i],'link' + i);
    }
}


// 创建一个新的单选按钮
function createRadioGroup(parentElement,downloadInfo,name){
    let linkInfos = downloadInfo.linkInfos;

    let titleDiv = document.createElement('div');
    //创建视频号码
    let labelElement = document.createElement('label'); // 创建 label
    labelElement.textContent = '▽' + downloadInfo.videoName + ' : '; // 设置每个label的文本内容
    titleDiv.appendChild(labelElement);
    let selectLabel = document.createElement('label_selected'); // 创建 label
    titleDiv.appendChild(selectLabel);
    titleDiv.addEventListener('click',()=>{
        foldEle(radioGroupDiv)
    })
    parentElement.appendChild(titleDiv);

    //单选按钮组
    var radioGroupDiv = document.createElement('div');
    radioGroupDiv.setAttribute('id', 'div_'+ name);
    //默认隐藏
    radioGroupDiv.classList.add('fold');
    parentElement.appendChild(radioGroupDiv);

    for(let j = 0; j < linkInfos.length; j++){
        let linkInfoItem = linkInfos[j]
        var textContent = linkInfoItem.size+';';
        if(linkInfoItem.hasChinese){
            textContent = textContent + ' 有字幕'
        }
        // 创建一个单选按钮
        let radioButton = document.createElement('input');
        // 设置input元素的类型为radio
        radioButton.setAttribute('id', name + j);
        radioButton.setAttribute('type', 'radio');
        radioButton.setAttribute('name', name);
        radioButton.setAttribute('value', linkInfoItem.link);
        radioGroupDiv.appendChild(radioButton);
        // 单选按钮文字
        let radioLabel = document.createElement('label'); // 创建 label
        radioLabel.setAttribute('for', radioButton.id);
        radioLabel.textContent = textContent; // 设置每个label的文本内容
        radioGroupDiv.appendChild(radioLabel);
        //换行
        radioGroupDiv.appendChild(document.createElement('br'));
        //添加选中监听
        radioButton.addEventListener('change', function() {
            if(this.checked){
                console.log('Radio被选中了！');
                selectLabel.textContent = radioLabel.textContent
            }else{
                 console.log('Radio未被选中。');
            }
        });

        //第一个默认选中
        if(j == 0){
            selectLabel.textContent = radioLabel.textContent
        }
        radioButton.checked = j == 0;
    }
}

function foldEle(ele){
    if(ele.classList.contains('fold')){
        ele.classList.remove('fold');
    }else{
        ele.classList.add('fold');
    }
}

function clearForm(){
    document.getElementById('download_info_form').innerHTML = '';
}

