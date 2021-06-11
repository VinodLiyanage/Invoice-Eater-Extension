/***********************************************************************
  
  https://github.com/VinodLiyanage/Invoice-Eater-Extension
  -------------------------------- (C) ---------------------------------
                           Author: Vinod Liyanage
                         <vinodsliyanage@gmail.com>
************************************************************************/

function injector(orderElementObjectArray) {
  if (!(orderElementObjectArray && orderElementObjectArray.length)) return;

  function injectInvoiceNumber(orderId, orderIndex) {
    const INVOICE_INPUT_ID = `order(${orderIndex}).invoicenumber`;

    const inputInvoice = document.getElementById(INVOICE_INPUT_ID);
    if (!(inputInvoice && inputInvoice instanceof HTMLElement)) return;
    inputInvoice.value = (orderId || "").trim();
    inputInvoice.dispatchEvent(new Event("change"));
  }

  function injectQuantities(element, orderIndex) {
    let isElementFound = false;

    const findElementUsingItemId = () => {
      const inputArray = Array.from(
        element.querySelectorAll(
          "table.fw_widget_table tbody tr.fw_widget_tablerow-odd td input[name]"
        ) || []
      );
      let itemId = null;

      if (inputArray.length) {
        inputArray.forEach((inputElm) => {
          if (!(inputElm && inputElm instanceof HTMLElement)) return;
          const re = /(?:.+?)\.(?:item\((\d+)\))?/gim;
          const itemIdArr = Array.from(re.exec(inputElm.name) || []);
          if (itemIdArr && itemIdArr.length > 1) {
            itemId = itemIdArr[1];
            return;
          }
        });
      }
      if (!itemId) return;

      const INVOICE_QUANTITY_ID = `order(${orderIndex}).item(${itemId}).invoiced`;
      const inputQuantity = document.getElementById(INVOICE_QUANTITY_ID);

      if (!(inputQuantity && inputQuantity instanceof HTMLElement)) return;

      let qty = inputQuantity?.parentElement?.previousElementSibling?.innerText;
      if (qty && qty.length) {
        isElementFound = true;
        qty = qty.trim();
        inputQuantity.value = qty;
        inputQuantity.dispatchEvent(new Event("change"));
      }
    };

    const findElementUsingStucture = () => {
      const parentElement = element.querySelector(
        "table.fw_widget_table tbody tr.fw_widget_tablerow-odd"
      );
      if (
        !(
          parentElement &&
          parentElement instanceof HTMLElement &&
          parentElement.hasChildNodes()
        )
      )
        return;

      const lastElm = parentElement.lastElementChild;

      const inputQuantity = lastElm.querySelector("input[name]");
      let qty = lastElm?.previousElementSibling?.innerText;

      if (qty && qty.length) {
        qty = qty.trim();
        isElementFound = true;
        inputQuantity.value = qty;
        inputQuantity.dispatchEvent(new Event("change"));
      }
    };

    findElementUsingItemId();

    if (!isElementFound) {
      findElementUsingStucture();
    }
  }

  orderElementObjectArray.forEach((elmObject) => {
    const { element, orderId, orderIndex } = elmObject;
    if (!(element && element instanceof HTMLElement)) return;

    if (element && orderId && orderIndex) {
      injectInvoiceNumber(orderId, orderIndex);
      injectQuantities(element, orderIndex);
    }
  });
}

function getOrderQueue() {
  const orderElementObjectArray = [];

  const orderForm = document.querySelector(
    'form[name="GeneralOrderRealmForm"][id="primaryForm"]'
  );
  if (!(orderForm && orderForm instanceof HTMLElement)) {
    return;
  }
  const orderElementArray = Array.from(
    orderForm.querySelectorAll(".fw_widget_windowtag") || []
  );

  orderElementArray.forEach((elm) => {
    if (!(elm && elm instanceof HTMLElement)) return;

    const orderIdElement = elm.querySelector(
      "div.fw_widget_windowtag_topbar div.framework_fiftyfifty_left_justify span.no_emphasis_label a.simple_link"
    );
    if (!(orderIdElement && orderIdElement instanceof HTMLElement)) {
      return;
    }

    let orderId = (orderIdElement.innerText || "").trim();
    if (!(orderId && orderId.length)) return;

    let orderIndex;
    try {
      const refIdFromPrevElement = (
        elm.previousElementSibling.value || ""
      ).trim();

      let refIdFromOrderElement = null;
      try {
        refIdFromOrderElement = (orderIdElement.href || "")
          .split("Hub_PO=")[1]
          .trim();
      } catch (e) {
        null;
      }

      if (refIdFromPrevElement && refIdFromPrevElement.length) {
        orderIndex = refIdFromPrevElement;
      } else if (refIdFromOrderElement && refIdFromOrderElement.length) {
        orderIndex = refIdFromOrderElement;
      } else return;
    } catch (e) {
      null;
    }

    if (!(orderIndex && orderIndex.length)) return;

    try {
      orderId = orderId.trim();
      orderIndex = orderIndex.trim();
    } catch (e) {
      return;
    }

    if (orderId.length) {
      orderElementObjectArray.push({
        element: elm,
        orderId,
        orderIndex,
      });
    }
  });
  return orderElementObjectArray;
}

(async () => {
  const orderElementObjectArray = getOrderQueue();
  injector(orderElementObjectArray);
})();
