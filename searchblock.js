const searchResults = document.querySelectorAll(".g");
const links = [...searchResults].map((item) => {
	return item.querySelector("a");
});
console.log(links);

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
			if (domains.some((domain) => link.href.includes(domain))) {
				searchResults[i].style.display = "none";
			} else {
				searchResults[i].style.display = "inherit";
			}
		});
	});
}
