chrome.tabs.executeScript({
    file: "content.js"
}, function () {
    if (chrome.runtime.lastError) {
        alert('Current page is blocking extension');
        return;
    }
});

