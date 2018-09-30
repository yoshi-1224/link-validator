// debugger;
var prevDOM = null;
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

function validate(parent_element) {
    anchors_to_validate = parent_element.find("a");
    anchors_to_validate.each(
        function (index) {
            var init = { redirect: "follow", cache: "no-cache", method: "HEAD" };
            anchor_tag = $(this);
            var url = anchor_tag.attr("href");
            if (url === undefined)
                return;
            if (url.indexOf("/") === 0) // just for now, filter relative paths.
                return;

            this.anchor_tag = anchor_tag; // for binding
            this.url = url;

            fetch(url, init).then(
                function (response) {
                    // console.log(this.url);
                    // console.log(response.url);
                    // console.log("redirected =" + response.redirected);
                    // console.log("code=" + response.status);
                    if (response.redirected) {
                        // check if the redirect is just for https
                        this.url = cleanUrl(this.url);
                        response_url = cleanUrl(response.url);
                        if (compareUrl(this.url, response_url))
                            return;
                    } else if (response.ok) {
                        // this order is important, as some redirects will somehow
                        // give 200 status code.
                        return;
                    }

                    // 404, redirected to homepage etc.
                    // TODO: method not allowed = 405, even though the link should be valid.
                    this.anchor_tag.css("text-decoration", "line-through");
                }.bind(this)
            ).catch(function (response) { // network error. Note that this has nothing to do with the status code like 404
                // here, things like ERR_NAME_NOT_RESOLVED are included as well.
                this.anchor_tag.css("text-decoration", "line-through");
                //TODO we need to separate above error with Mixed Content stuff.
            }.bind(this));
        });
}

function compareUrl(request_url, response_url) {
    if (!request_url.lastIndexOf("/") === -1) {
        // if there is specific file to look at, it is possible the domain changed.
        // in that case, we only take a look at the file match.
        request_url = request_url.slice(request.url.lastIndexOf("/") + 1);
        response_url = response_url.slice(response.url.lastIndexOf("/") + 1);
        // if / is not found in response_url, it will be slice(0) == no change.
    } // otherwise, it just contains the domain

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
    return url.lastIndexOf("#") !== -1 ? url.slice(lastIndexOf("#")+1) : url;
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

setMouseMoveHandler();
setClickEvent();

