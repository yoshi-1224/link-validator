chrome.browserAction.onClicked.addListener(function(tab) { // this doesn't fire if you have popup.html
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function(tabs) {
        var updateProperties = {
            "active": true
        };
        chrome.tabs.update(tabs[0].id, updateProperties, function(tab) {

            chrome.tabs.executeScript(tab.id, {
                file: "content.js"
            }, function() {
                if (chrome.runtime.lastError) {
                    alert("extension is blocked");
                    return;
                }
            });
        }); // end update
    }) // end tabs.query
});

// "background": {
//     "scripts": [
//         "background.js"
//     ]
// }