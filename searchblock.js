const searchResults = document.querySelectorAll("#search .iwb-detected > .g");

searchResults.forEach((result) => {
  const hostname = result.querySelector("a").host;
  result.insertAdjacentHTML(
    "afterbegin",
    `<div class=block-link>Block domain "${hostname}" from search results</div>`
  );
  result.querySelector(".block-link").addEventListener("click", (e) => {
    addDomain(hostname);
  });
});

hideBlocked();

window.addEventListener("storage", (e) => {
  hideBlocked();
});

function getBlockedDomains() {
  return JSON.parse(localStorage.getItem("domains")) ?? [];
}

function setBlockedDomains(domains) {
  localStorage.setItem("domains", JSON.stringify(domains));
  hideBlocked();
}

function regexTest(blockedDomain, testDomain) {
  const domainRegex = new RegExp(blockedDomain, "i");
  return domainRegex.test(testDomain);
}

function testHostBlocked(host) {
  const domains = getBlockedDomains();
  return domains.some((domain) => regexTest(domain, host));
}

function hideBlocked() {
  searchResults.forEach((result, i) => {
    const hostname = result.querySelector("a").host;
    if (testHostBlocked(hostname)) {
      result.style.display = "none";
      result.insertAdjacentHTML(
        "beforebegin",
        `<div id=${hostname}>Blocked result from "${hostname}". <button>Unblock domain</button></div>`
      );
      document
        .querySelectorAll(`#${hostname.split(".").join("\\.")} button`)
        .forEach((el) =>
          el.addEventListener("click", (e) => {
            removeDomain(hostname);
          })
        );
    } else {
      result.style.display = "inherit";
      document
        .querySelectorAll(`#${hostname.split(".").join("\\.")}`)
        .forEach((el) => el.remove());
    }
  });
}

function addDomain(domain) {
  if (domain != "") {
    const domains = getBlockedDomains();
    if (!testHostBlocked(domain)) {
      domains.push(domain);
      localStorage.setItem("domains", JSON.stringify(domains));
      hideBlocked();
    }
  }
}

function removeDomain(domain) {
  if (domain != "") {
    const domains = getBlockedDomains();
    if (testHostBlocked(domain)) {
      setBlockedDomains(domains.filter((d) => !regexTest(d, domain)));
      hideBlocked();
    }
  }
}

browser.runtime.onMessage.addListener((request) => {
  switch (request.action) {
    case "get":
      return Promise.resolve(getBlockedDomains());
    case "set":
      setBlockedDomains(request.domains);
      return Promise.resolve();
    case "add":
      addDomain(request.domain);
      return Promise.resolve();
    case "remove":
      removeDomain(request.domain);
      return Promise.resolve();
    default:
      return Promise.resolve();
  }
});
