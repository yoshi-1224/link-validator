chrome.tabs.executeScript({
    file: "content.js"
}, function () {
    if (chrome.runtime.lastError) {
        alert('Current page is blocking extension');
        return;
    }
});

// fetch("http://hash.hateblo.jp/entry/20081021/1224516741", { method: "HEAD" })
//     .then(function (response) {
//         console.log(response)
//     }) // fetch is possible for http as well.

// console.log("document.domain="+document.domain);
// console.log("location.protocol="+window.location.protocol);
