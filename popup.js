document.addEventListener("DOMContentLoaded", () => {
  restoreInput();
  handler();
});

function handler() {
  const inputTargetUrl = document.getElementById("inputTargetUrl");
  const submitBtn = document.getElementById("submit");
  const resetBtn = document.getElementById("reset");

  if (!(inputTargetUrl instanceof HTMLElement)) return;
  if (!(submitBtn instanceof HTMLElement)) return;
  if (!(resetBtn instanceof HTMLElement)) return;

  const handleInput = (e) => {
    let value = e.target?.value;

    if (value && value.length) {
      value = value.trim();
    }
    chrome.storage.local.set({ targetUrl: value });
  };

  const handleLoad = () => {
    const targetUrl = (inputTargetUrl.value || "").trim();
    if (!(targetUrl && targetUrl.length)) return;

    chrome.runtime.sendMessage({ targetUrl }, function (response) {
      return response;
    });
  };

  const handleReset = () => {
    inputTargetUrl.value = "";
    chrome.storage.local.remove("targetUrl");
  };
  
  inputTargetUrl.addEventListener("input", handleInput);
  submitBtn.addEventListener("click", handleLoad);
  resetBtn.addEventListener("click", handleReset);

}

function restoreInput() {
  const inputTargetUrl = document.getElementById("inputTargetUrl");

  chrome.storage.local.get("targetUrl", (result) => {
    const targetInputValue = result.targetUrl;

    if (targetInputValue) {
      inputTargetUrl.value = targetInputValue;
    }
  });
}

