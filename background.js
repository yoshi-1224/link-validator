var init = { redirect: "follow", cache: "no-cache", method: "HEAD" };

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        Promise.all(request.links.map(function (link) {
            return fetch(link, init).catch(function (error) { return error });
        })).then(function (responses) { // it is now plural
            // console.log(responses);
            values = new Array(responses.length);
            for (i = 0; i < responses.length; i++) {
                if (responses[i] instanceof TypeError) {
                    values[i] = false;
                } else if (responses[i].redirected) {
                    let request_link = cleanUrl(request.links[i]);
                    let response_link = cleanUrl(responses[i].url);
                    console.log(request_link);
                    console.log(response_link);
                    values[i] = compareUrl(request_link, response_link);
                } else if (responses[i].ok) {
                    // this order is important as some redirected ones return ok.
                    values[i] = true;
                } else {
                    values[i] = false;
                }
            }
            sendResponse({ values: values });
        });
        return true; // to make it synchronous
    }
);

function compareUrl(request_url, response_url) {
    if (request_url.lastIndexOf("/") !== -1) {
        // console.log("checking file only");
        // if there is specific file to look at, it is possible the domain changed.
        // in that case, we only take a look at the file match.
        request_url = request_url.slice(request_url.lastIndexOf("/") + 1);
        response_url = response_url.slice(response_url.lastIndexOf("/") + 1);
        // if / is not found in response_url, it will be slice(0) == no change.
    } // otherwise, it just contains the domain

    console.log(request_url +" <=== >"+ response_url);
    return request_url === response_url;
}

function cleanUrl(url) {
    return stripHashTag(stripTrailingSlash(stripProtocol(url)));
}

function stripProtocol(url) {
    return url.replace("http://", "").replace("https://", "");
}

function stripTrailingSlash(url) {
    return url.endsWith("/") ? url.slice(0, -1) : url;
}

function stripHashTag(url) {
    return url.lastIndexOf("#") !== -1 ? url.slice(0, url.lastIndexOf("#") - 1) : url;
}

//https://javascript.info/promise-api#fault-tolerant-promise-all
//https://qiita.com/Tachibana446/items/ab15021099d54d1209c2