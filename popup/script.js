const del = document.querySelector(".delete");
const add = document.querySelector(".add");
const clear = document.querySelector(".clear");

const selector = document.querySelector("select");

syncOptions();

del.addEventListener("click", (e) => {
	console.log(selector.selectedOptions[0].text);
	browser.storage.local.get("domains").then((domains) => {
		deleteOption(selector.selectedOptions[0].text, selector.selectedIndex);
	});
});

add.addEventListener("click", (e) => {
	const domainValue = add.previousElementSibling.value;
	browser.storage.local
		.get("domains")
		.then((prevList) => {
			let domains = prevList.domains === undefined ? [] : prevList.domains;
			domains.push(add.previousElementSibling.value);
			console.log({ domains });
			browser.storage.local.set({
				domains: domains,
			});
		})
		.then(console.log("set"));
	addOption(domainValue);
});

clear.addEventListener("click", (e) => clearOptions());

function addOption(domain) {
	let option = document.createElement("option");
	option.text = domain;
	selector.add(option);
}

function deleteOption(domain, index) {
	//let domains = [...selector.options].slice(1);
	selector.remove(index);
	browser.storage.local.get("domains").then((obj) => {
		browser.storage.local.set({
			domains: obj.domains.filter((word) => word !== domain),
		});
		console.log("deleted");
	});
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
