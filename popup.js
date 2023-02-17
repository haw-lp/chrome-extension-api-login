"use strict";

/**
 *
 *  ============================================================
 *   Settings for default styles
 *  ============================================================
 *
 */
document.addEventListener("DOMContentLoaded", function () {
    const extIframePanel = document.getElementById("ext-iframe");
    const extLoginPanel = document.getElementById("login-container");
    const form = document.getElementById("form");
    extIframePanel.setAttribute("style", "width: 300px; height: 400px;");

    /**
     * Retrieve object from Chrome's Local StorageArea
     * @param {string} key
     */
    const getObjectFromLocalStorage = async function (key) {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.get(key, function (value) {
                    if (!chrome.runtime.error) {
                        resolve(value[key]);
                    }
                });
            } catch (ex) {
                reject(ex);
            }
        });
    };

    // Set window screen
    function setWindowScreen() {
        getObjectFromLocalStorage("token")
            .then((value) => {
                if (value != null || value != undefined) {
                    extIframePanel.style.display = "block";
                    extLoginPanel.style.display = "none";
                } else {
                    extIframePanel.style.display = "none";
                    extLoginPanel.style.display = "block";
                }
            })
            .catch((error) => {
                console.error(error); // Handle the error if the promise was rejected
            });
    }

    // Set the token from local storage
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let formData = Object.fromEntries(new FormData(form));
        chrome.runtime.sendMessage(
            { action: "postData", data: formData },
            function (response) {
                if (response.success) {
                    let sampleObject = {
                        token: "Bearer " + response.data.data.token,
                    };
                    chrome.storage.sync.set(sampleObject, function () {
                        if (!chrome.runtime.error) {
                            setWindowScreen();
                        }
                    });
                } else {
                    alert(response.data.message);
                }
            }
        );
    });

    // Log out the user
    document.getElementById("log-out").onclick = function () {
        chrome.storage.sync.remove("token", function () {
            if (!chrome.runtime.error) {
                setWindowScreen();
            }
        });
    };

    // Load window screen
    setWindowScreen();
});
