// debugger;
var prevDOM = null;
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
var anchors;

function validate(parent_element) {
    anchors = parent_element.find("a");
    // console.log("anchors.length=" + anchors.length);
    anchors = anchors.filter(function (index) {
        let link = $(this).attr("href");
        // console.log(link);
        return (link !== undefined && link.indexOf("/") !== 0);
    });

    // console.log("filtered anchors.length=" + anchors.length);

    let urls_to_validate = anchors.map(function (index) {
        return $(this).attr("href");
    }).get(); // get() makes it a basic array from jQuery object

    // console.log(urls_to_validate);
    if (urls_to_validate.length === 0)
        return;
        
    sendMessage(urls_to_validate);
}

function setMouseMoveHandler() {
    document.addEventListener('mousemove', mouseOverHandler, false);
}

function setClickEvent() {
    document.addEventListener('click', clickEventHandler, false);
}

function mouseOverHandler(e) {
    let srcElement = e.srcElement;
    valid_tags = ["DIV", "P", "SECTION"];
    if (prevDOM != srcElement) {
        // go back up to the closest wrapper.
        while (!valid_tags.includes(srcElement.nodeName) && srcElement.parentNode) {
            srcElement = srcElement.parentNode;
        }

        if (prevDOM != null && prevDOM.classList !== undefined) {
            prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
        }

        if (srcElement.classList !== undefined)
            srcElement.classList.add(MOUSE_VISITED_CLASSNAME);
        prevDOM = srcElement;
    }
}

function clickEventHandler(e) { // need to be non-anonymous function because we 
    // need it later to remove this handler.
    if (prevDOM != null) {
        validate($(prevDOM));
        // sendMessage($(prevDOM));
        removeHandlers();
    }
}

function removeHandlers() {
    if (prevDOM != null && prevDOM.classList !== undefined) {
        prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
        prevDOM = null;
    }

    document.removeEventListener('click', clickEventHandler, false);
    document.removeEventListener('mousemove', mouseOverHandler, false);
}

function sendMessage(urls) {
    chrome.runtime.sendMessage({ links: urls }, function (response) {
        console.log("message received in content.js");
        console.log(response);
        // for (i=0; i < response.values.length; i++) {
        //     if (response.values[i]) {
        //         anchor_tag.css("text-decoration", "line-through");
        //     }
        // }
        console.log(anchors);
        anchors.each(function (index) {
            if (!response.values[index]) {
                $(this).css("text-decoration", "line-through");
            }

        })


    });
}
setMouseMoveHandler();
setClickEvent();

