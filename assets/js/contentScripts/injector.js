const log = console.log;

function injector(orderElementObjectArray) {
  if (!(orderElementObjectArray && orderElementObjectArray.length)) return;

  //order(3044612952).invoicenumber
  //order(3044612952).item(3052881896).invoiced

  function injectInvoiceNumber(orderId, orderIndex) {
    const INVOICE_INPUT_ID = `order(${orderIndex}).invoicenumber`;

    const inputInvoice = document.getElementById(INVOICE_INPUT_ID);
    if (!(inputInvoice && inputInvoice instanceof HTMLElement)) return;
    inputInvoice.value = (orderId || "").trim();
    inputInvoice.dispatchEvent(new CustomEvent('change'))
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
            log("itemId", itemId);
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
        inputQuantity.dispatchEvent(new CustomEvent('change'))
        log("elmentfound in method 1");
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
        inputQuantity.dispatchEvent(new CustomEvent('change'))
        log("elmentfound in method 2");
      }
    };

    //? not implemented yet.
    const findElementUsingColumnName = () => {
      log("elmentfound in method 3");
    };

    findElementUsingItemId();

    if (!isElementFound) {
      findElementUsingStucture();
    }
    if (!isElementFound) {
      findElementUsingColumnName();
    }
  }

  const orderForm = document.querySelector(
    'form[name="GeneralOrderRealmForm"][id="primaryForm"]'
  );

  orderElementObjectArray.forEach((elmObject) => {
    const { element, orderId, orderIndex } = elmObject;
    if (!(element && element instanceof HTMLElement)) return;

    if (element && orderId && orderIndex) {
      injectInvoiceNumber(orderId, orderIndex);
      injectQuantities(element, orderIndex);
    
    }
  });

  
  // dispatchEvent(new CustomEvent('change'))

}
function getOrderQueue() {
  const orderElementObjectArray = [];

  const orderForm = document.querySelector(
    'form[name="GeneralOrderRealmForm"][id="primaryForm"]'
  );
  if (!(orderForm && orderForm instanceof HTMLElement)) {
    console.error("orderForm not found!");
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
      console.error("orderIdElement not found!");
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
        console.error(e);
      }

      if (refIdFromPrevElement && refIdFromPrevElement.length) {
        orderIndex = refIdFromPrevElement;
      } else if (refIdFromOrderElement && refIdFromOrderElement.length) {
        orderIndex = refIdFromOrderElement;
      } else return;
    } catch (e) {
      console.error(e);
    }

    if (!(orderIndex && orderIndex.length)) return;

    try {
      orderId = orderId.trim();
      orderIndex = orderIndex.trim();
    } catch (e) {
      console.error("[injector] an error occured!", e);
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

  log("orderElementObjectArray", orderElementObjectArray);
  return orderElementObjectArray;
}

(async () => {
  log("content script started!");
  const orderElementObjectArray = getOrderQueue();
  injector(orderElementObjectArray);
})();
