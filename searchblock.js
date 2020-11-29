const searchResults = document.querySelectorAll(".g");
const links = [...searchResults].map((item) => {
	return item.querySelector("a");
});
console.log(links);

hideBlocked();

browser.storage.onChanged.addListener((changes, areaName) => {
	console.log("changed");
	hideBlocked();
});

async function getDomains() {
	return await browser.storage.local.get("domains");
}

function hideBlocked() {
	getDomains().then((storageObj) => {
		let domains = storageObj.domains;
		console.log(domains);
		links.forEach((link, i) => {
			if (domains.some((domain) => link.href.includes(domain))) {
				searchResults[i].style.display = "none";
			} else {
				searchResults[i].style.display = "inherit";
			}
		});
	});
}
