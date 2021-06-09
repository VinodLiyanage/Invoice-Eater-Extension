const log = console.log;

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
      console.error(e);
      reject(false);
    }
  });
}

//*listen for the incoming messages from popup.js
function listener(listenerCallback) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse({ farewell: "goodbye" });

    const targetUrl = request.targetUrl;

    listenerCallback(targetUrl);
    return true;
  });
}

async function listenerCallback(targetUrl) {
  log("im in background", targetUrl);
  const tabId = await navigator(targetUrl);

  tabIdObject[tabId] = true;
//   await executeContentScript(tabId);
  log("tabId", tabId);
}

(() => {
  listener(listenerCallback);

//   chrome.tabs.onUpdated.addListener(async (updatedTabId, changeInfo) => {
//     if (changeInfo.status === "complete") {
//       if (tabIdObject[updatedTabId]) {
//         await executeContentScript(updatedTabId);
//       }
//     }
//     return true;
//   });
})();
