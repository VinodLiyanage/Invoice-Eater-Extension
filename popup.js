const log = console.log;

function submit() {
  const inputTargetUrl = document.getElementById("inputTargetUrl");
  const submitBtn = document.getElementById("submit");

  if (!(inputTargetUrl instanceof HTMLElement)) return;
  if (!(submitBtn instanceof HTMLElement)) return;

  const handleLoad = () => {
    const targetUrl = (inputTargetUrl.value || "").trim();
    if (!(targetUrl && targetUrl.length)) return;

    chrome.storage.local.set({ targetUrl });

    chrome.runtime.sendMessage({ targetUrl }, function (response) {
      console.log(response);
    });
  };

  submitBtn.addEventListener("click", handleLoad);
}

function resetInput() {
  const resetBtn = document.getElementById("reset");
  const inputTargetUrl = document.getElementById("inputTargetUrl");

  if (
    !(
      resetBtn &&
      inputTargetUrl &&
      resetBtn instanceof HTMLElement &&
      inputTargetUrl instanceof HTMLElement
    )
  ) {
    console.error("[reset] an error occured!");
    return;
  }
  const handleReset = () => {
    inputTargetUrl.value = "";
    chrome.storage.local.remove("targetUrl");
  };
  resetBtn.addEventListener("click", handleReset);
}

function restoreInput() {
  const inputTargetUrl = document.getElementById("inputTargetUrl");

  chrome.storage.local.get("targetUrl", (result) => {
    const targetInputValue = result.targetUrl;

    if (!!targetInputValue) {
      inputTargetUrl.value = targetInputValue;
    }
  });
}

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    restoreInput();
    submit();
    resetInput();
  });
})();
