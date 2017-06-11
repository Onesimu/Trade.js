function p(val) {
	console.info(val);
}

function getContextPath() {
	var pathName = document.location.pathname;
	var index = pathName.substr(1).indexOf("/");
	var result = pathName.substr(0, index + 1);
	return result;
}
function getContextHostW() {
	return window.location.host + getContextPath();
}
function getContextHost() {
	return "http://" + window.location.host + getContextPath();
}
