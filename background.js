let absoluteTabId = null

chrome.runtime.onMessage.addListener(handleMessage);
chrome.tabs.onUpdated.addListener(handleTabUpdate);

async function handleMessage(request, sender, sendResponse) {
  sendResponse(true);
  if (!sender.tab && request.targetUrl) {
    absoluteTabId = await navigator(request.targetUrl);
  }
  return true;
}

function handleTabUpdate(tabId, changeInfo) {
  if (
    absoluteTabId &&
    absoluteTabId === tabId &&
    changeInfo.status === "complete"
  ) {
    executeScript(absoluteTabId);
    absoluteTabId = null;
  }
}

async function navigator(targetUrl) {
  if (!(targetUrl && targetUrl.length)) return;

  const promise = await chrome.tabs.create({ active: true, url: targetUrl });
  return promise.id;
}

//* injecting content script and sending message to that injected content script.
function executeScript(tabId) {
  if (!tabId) return;

  chrome.scripting.executeScript(
    {
      files: ["/assets/js/contentScripts/injector.js"],
      target: { tabId },
    },
    () => {
      chrome.tabs.sendMessage(
        tabId,
        { command: "startScript", name: "DROPSHIPPING_TOOL_INVOICY" },
        (response) => response
      );
    }
  );
}
