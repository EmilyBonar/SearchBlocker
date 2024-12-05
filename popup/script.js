const del = document.querySelector(".delete");
const add = document.querySelector(".add");
const clear = document.querySelector(".clear");

const domainListSelect = document.querySelector("select");

syncDomains();

del.addEventListener("click", (e) => {
  handleRemoveDomain(
    domainListSelect.selectedOptions[0].text,
    domainListSelect.selectedIndex
  );
});

add.addEventListener("click", (e) => {
  const domainValue = add.previousElementSibling.value;
  handleAddDomain(domainValue);
  add.previousElementSibling.value = "";
});

clear.addEventListener("click", (e) => clearDomains());

browser.storage.onChanged.addListener((changes, areaName) => {
  syncDomains();
});

function handleAddDomain(domain) {
  if (domain != "") {
    addToSelector(domain);
    sendMessageToTab({ action: "add", domain });
  }
}

function addToSelector(domain) {
  let domainOption = document.createElement("option");
  domainOption.text = domain;
  domainListSelect.add(domainOption);
}

function handleRemoveDomain(domain, index) {
  if (index != 0) {
    domainListSelect.remove(index);
    sendMessageToTab({ action: "remove", domain });
  }
}

async function syncDomains() {
  clearSelector();
  const domains = await sendMessageToTab({ action: "get" });

  domains.forEach((domain) => addToSelector(domain));
}

function clearDomains() {
  sendMessageToTab({ action: "set", domains: [] });
  clearSelector();
}

function clearSelector() {
  [...domainListSelect.options].forEach((item, index) => {
    if (index != 0) {
      domainListSelect.remove(index);
    }
  });
}

async function sendMessageToTab(message) {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const response = await browser.tabs.sendMessage(tabs[0].id, message);

  return response;
}
