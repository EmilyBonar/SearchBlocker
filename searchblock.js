const searchResults = document.querySelectorAll(".rc");
console.log("test");
getDomains().then((domains) => {
	console.log("test3");
	domains.forEach((domain) => {
		console.log(domain);
	});
});

browser.storage.onChanged.addListener((changes, areaName) => {
	console.log("test4");
});

async function getDomains() {
	return await browser.storage.local.get("domains");
}
