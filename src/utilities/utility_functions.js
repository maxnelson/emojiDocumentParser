const remove_decimal_number = (input) => {
	const regex = /^\d+\.\d+\s+(.*)$/;
	const match = input.match(regex);
	return match ? match[1] : null;
};

module.exports = remove_decimal_number;
