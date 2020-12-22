const searchResults = document.querySelectorAll(".g");
const links = [...searchResults].map((item) => {
	return item.querySelector("a");
});

links.forEach((result) => {
	console.log();
	result.insertAdjacentHTML(
		"afterend",
		"<br><a class=block-link>Block this domain from appearing in search results.</a>",
	);
	result.nextElementSibling.nextElementSibling.addEventListener(
		"click",
		(e) => {
			addOption(result.host);
		},
	);
});

hideBlocked();

browser.storage.onChanged.addListener((changes, areaName) => {
	hideBlocked();
});

async function getDomains() {
	return await browser.storage.local.get("domains");
}

function hideBlocked() {
	getDomains().then((storageObj) => {
		let domains = storageObj.domains;
		links.forEach((link, i) => {
			if (
				domains.some((domain) =>
					link.href.toLowerCase().includes(domain.toLowerCase()),
				)
			) {
				searchResults[i].style.display = "none";
			} else {
				searchResults[i].style.display = "inherit";
			}
		});
	});
}

function addOption(domain) {
	if (domain != "") {
		browser.storage.local.get("domains").then((prevList) => {
			let domains = prevList.domains === undefined ? [] : prevList.domains;
			if (!domains.includes(domain)) {
				domains.push(domain);
				browser.storage.local.set({
					domains: domains,
				});
			}
		});
	}
}
