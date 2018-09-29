// note that even though this is named as content.js, it doens't have much of a link
// to manifest.json because it is just loaded as part of popup.html.

// $("#run").append("<p>harara</p>");
var bkg = chrome.extension.getBackgroundPage();

function validate(element) {
    bkg.console.log(element);
    // traverse through the link tags of the element
    anchors_to_validate = element.find("a");
    bkg.console.log(anchors_to_validate.length);
    bkg.console.log(document.querySelectorAll("a").length);
    // anchors_to_validate.foreach(function(anchor_tag) {
    //     // make requests to check. need callback
    //     fetch(anchor_tag.attr("href")).then(
    //         function(response) {
    //             console.log(response);
    //         }
    //     )
    // }); // not a JS array so we cannot use foreach. Use jQuery specific function instead.
    $.each(anchors_to_validate, function (anchor_tag) {
        // make requests to check. need callback
        var init = { redirect: "error", cache: "no-cache" };
        var url = anchor_tag.attr("href");
        fetch(url, init).then(
            function (response) {
                if (!response.ok) {
                    bkg.console.log('foo'); // this will go to the background page.
                    anchor_tag.css("text-decoration", "line-through");
                } else {
                    bkg.console.log('bar');
                }
            }
        )
    });
}

validate($("body"));
