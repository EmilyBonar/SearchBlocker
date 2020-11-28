const buttons = document.querySelectorAll(".button");
const del = buttons[1];
const add = buttons[0];

const selector = document.querySelector("select");

del.addEventListener("click", (e) => {
	console.log(selector.selectedOptions[0].text);
	browser.storage.local.get("domains");
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

function addOption(domain) {
	let option = document.createElement("option");
	option.text = domain;
	selector.add(option);
}
