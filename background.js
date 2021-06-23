chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  sendResponse(true);
  if (!sender.tab && request.targetUrl) {
    executeScript(await navigator(request.targetUrl));
  }
  return true;
});

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
