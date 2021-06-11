/***********************************************************************
  
  https://github.com/VinodLiyanage/Invoice-Eater-Extension
  -------------------------------- (C) ---------------------------------
                           Author: Vinod Liyanage
                         <vinodsliyanage@gmail.com>
************************************************************************/

function submit() {
  const inputTargetUrl = document.getElementById("inputTargetUrl");
  const submitBtn = document.getElementById("submit");

  if (!(inputTargetUrl instanceof HTMLElement)) return;
  if (!(submitBtn instanceof HTMLElement)) return;

  const handleInput = (e) => {
    let value = e.target.value;

    if (value && value.length) {
      value = value.trim();
    }
    chrome.storage.local.set({ targetUrl: value });
  };

  const handleLoad = () => {
    const targetUrl = (inputTargetUrl.value || "").trim();
    if (!(targetUrl && targetUrl.length)) return;

    chrome.runtime.sendMessage({ targetUrl }, function (response) {
      console.log(response);
    });
  };

  inputTargetUrl.addEventListener("input", handleInput);
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
