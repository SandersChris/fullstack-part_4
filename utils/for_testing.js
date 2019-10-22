const palindrome = string => {
	return string
		.split('')
		.reverse()
		.join('')
}

const average = array => {
	const reducer = (sum, item) => {
		return sum + item
	}

	return array.reduce(reducer, 0) / array.length
}

// eslint-disable-next-line no-undef
module.exports = {
	palindrome,
	average,
}