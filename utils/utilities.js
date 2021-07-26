"Use strict";
exports.removeExtensionFromFile = file =>
	file.split('.')
		.slice(0, -2)
		.join('.')
		.toString();

exports.create_clean_string = Text => {
	return Text.toLowerCase().replace(/ +/g, '-');
}