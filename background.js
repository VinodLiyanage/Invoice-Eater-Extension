/***********************************************************************
  
  https://github.com/VinodLiyanage/Invoice-Eater-Extension
  -------------------------------- (C) ---------------------------------
                           Author: Vinod Liyanage
                         <vinodsliyanage@gmail.com>
************************************************************************/

const tabIdObject = {};

//* creates a new tab that contains the target webpage.
async function navigator(targetUrl) {
  /**
   * @param {string} targetUrl - the webpage url that need to fill.
   * @returns {string} id - tabs' id
   */

  if (!(targetUrl && targetUrl.length)) return;

  const promise = await chrome.tabs.create({ active: true, url: targetUrl });
  return promise.id;
}

//* inject content script to the new tab and execute.
async function executeContentScript(tabId) {
  return new Promise((resolve, reject) => {
    try {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          files: ["./assets/js/contentScripts/injector.js"],
        },
        () => {
          resolve(true);
        }
      );
    } catch (e) {
      reject(false);
    }
  });
}

//*listen for the incoming messages from popup.js
function listener(listenerCallback) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse({ farewell: "goodbye" });

    const targetUrl = request.targetUrl;
    if (targetUrl) {
      listenerCallback(targetUrl);
    }
    return true;
  });
}

async function listenerCallback(targetUrl) {
  const tabId = await navigator(targetUrl);
  if (tabId) {
    tabIdObject[tabId] = true;
  }
}

(() => {
  listener(listenerCallback);
})();
