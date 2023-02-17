"use strict";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "postData") {
        // handle the message here
        fetch("http://localhost:8000/api/sign-in", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Credentials": true,
                Accept: "application/json, application/xml, text/plain, text/html, *.*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request.data),
        })
            .then(response => response.json())
            .then(data => {
                sendResponse({ success: data.status, data: data });
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });
        return true; // This line indicates that we will be sending a response asynchronously.
    }
});
