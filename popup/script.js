const del = document.querySelector(".delete");
const add = document.querySelector(".add");
const clear = document.querySelector(".clear");

const selector = document.querySelector("select");

syncOptions();

del.addEventListener("click", (e) => {
	deleteOption(selector.selectedOptions[0].text, selector.selectedIndex);
});

add.addEventListener("click", (e) => {
	const domainValue = add.previousElementSibling.value;
	addOption(domainValue);
	add.previousElementSibling.value = "";
});

clear.addEventListener("click", (e) => clearOptions());

browser.storage.onChanged.addListener((changes, areaName) => {
	syncOptions();
});

function addOption(domain) {
	if (domain != "") {
		addToSelector();
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

function addToSelector(domain) {
	let option = document.createElement("option");
	option.text = domain;
	selector.add(option);
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
	clearSelector();
	browser.storage.local
		.get("domains")
		.then((obj) => obj.domains.forEach((domain) => addToSelector(domain)));
}

function clearOptions() {
	browser.storage.local.set({
		domains: [],
	});
	clearSelector();
}

function clearSelector() {
	console.log(selector.options);
	[...selector.options].forEach((item, index) => {
		if (index != 0) {
			selector.remove(index);
		}
	});
}
