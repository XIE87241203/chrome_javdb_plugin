var infoMap = new Map();

let busy = chrome.storage.session.get().then(data => {
    if(data.infoJson!==undefined){
          infoMap = jsonToMap(data.infoJson);
      }
      console.log('getState:', infoMap);
      busy = null;
});

const saveState = () => {
    const infoJson = mapToJson(infoMap);
    console.log('saveState:', infoMap);
    chrome.storage.session.set({
      infoJson
    })
};

//tab关闭的时候调用
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    if (busy) await busy;
    infoMap.delete(tabId.toString());
    console.log("onRemoved:", infoMap);
    await saveState();
});

//接收消息
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (busy){
        console.log("busy:", busy);
        await busy;
    }
    console.log("busyed:", busy);
    console.log("message.action:", message.action);
    switch(message.action){
        case "download_info":
            infoMap.set(sender.tab.id.toString(),message.data);
            console.log('onAdd:',infoMap);
            await saveState();
        break;
        case "del_storage":
            infoMap.clear();
            console.log('onClear:',infoMap);
            await saveState();
        break;
        case "get_info":
            sendResponse({info:Array.from(infoMap.values())})
        break;
        case "close_page":
            let tabIdList = Array.from(infoMap.keys());
            console.log('remove:',tabIdList);
            for(let i=0; i< tabIdList.length; i++){
                let tabId = parseInt(tabIdList[i]);
                console.log('remove tag:',tabId);
                chrome.tabs.remove(tabId)
            }
        break;
    }
});

function mapToJson(map){
    return JSON.stringify(Object.fromEntries(map)).toString();
}

function jsonToMap(jsonString){
    return new Map(Object.entries(JSON.parse(jsonString)));
}


