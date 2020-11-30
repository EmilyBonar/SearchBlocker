const del = document.querySelector(".delete");
const add = document.querySelector(".add");
const clear = document.querySelector(".clear");

const selector = document.querySelector("select");

syncOptions();

del.addEventListener("click", (e) => {
	browser.storage.local.get("domains").then((domains) => {
		deleteOption(selector.selectedOptions[0].text, selector.selectedIndex);
	});
});

add.addEventListener("click", (e) => {
	const domainValue = add.previousElementSibling.value;
	addOption(domainValue);
	add.previousElementSibling.value = "";
});

clear.addEventListener("click", (e) => clearOptions());

function addOption(domain) {
	if (domain != "") {
		let option = document.createElement("option");
		option.text = domain;
		selector.add(option);
		browser.storage.local.get("domains").then((prevList) => {
			let domains = prevList.domains === undefined ? [] : prevList.domains;
			domains.push(domain);
			browser.storage.local.set({
				domains: domains,
			});
		});
	}
}

function deleteOption(domain, index) {
	if (index != 0) {
		selector.remove(index);
		browser.storage.local.get("domains").then((obj) => {
			browser.storage.local.set({
				domains: obj.domains.filter((word) => word !== domain),
			});
		});
	}
}

function syncOptions() {
	browser.storage.local
		.get("domains")
		.then((obj) => obj.domains.forEach((domain) => addOption(domain)));
}

function clearOptions() {
	browser.storage.local.set({
		domains: [],
	});
	[...selector.options].forEach((item, index) => {
		if (index != 0) {
			selector.remove(index);
		}
	});
}
