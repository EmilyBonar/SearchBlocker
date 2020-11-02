const buttons = document.querySelectorAll(".button");
const del = buttons[0];
const add = buttons[1];

const selector = document.querySelector("select");

del.addEventListener("click", (e) => {
	console.log(selector.selectedOptions[0].text);
	browser.storage.local.get("domains");
});

add.addEventListener("click", (e) => {
	const domainValue = add.previousElementSibling.value;
	const prevList = browser.storage.local.get("domains");
	console.log(domainValue);
	browser.storage.local
		.set({
			domains: [...prevList, add.previousElementSibling.value],
		})
		.then(console.log("set"));
	addOption(domainValue);
});

function addOption(domain) {
	let option = document.createElement("option");
	option.text = domain;
	selector.add(option);
}
