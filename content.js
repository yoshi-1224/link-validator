// note that even though this is named as content.js, it doens't have much of a link
// to manifest.json because it is just loaded as part of popup.html.

// debugger;
function validate(element) {
    anchors_to_validate = element.find("a");
    // anchors_to_validate.foreach(function(anchor_tag) {
    //     // make requests to check. need callback
    //     fetch(anchor_tag.attr("href")).then(
    //         function(response) {
    //             console.log(response);
    //         }
    //     )
    // }); // not a JS array so we cannot use foreach. Use jQuery specific function instead.
    anchors_to_validate.each(function (index) {
        // make requests to check. need callback
        var init = { redirect: "error", cache: "no-cache", method: "HEAD" };
        // debugger;
        anchor_tag = $(this);
        // anchor_tag.css("background-color", "yellow"); // works here
        this.anchor_tag = anchor_tag;
        var url = anchor_tag.attr("href");

        console.log("url=" + url);

        fetch(url, init).then(
            function (response) {
                if (!response.ok) {
                    this.anchor_tag.css("text-decoration", "line-through");
                } else {
                    console.log('response OK');
                }
            }.bind(this)
        ).catch(function(error) { // redirect fails. But redirect for HTTPS should be allowed.
            this.anchor_tag.css("text-decoration", "line-through");
        }.bind(this));
    });
}

validate($("body"));
