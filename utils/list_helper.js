const dummy = blogs => {
	if (blogs.length === 0) {
		return 1
	}
}

const totalLikes = blogs => {
	const reducer = (sum, item) => sum + item.likes

	return blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {
	const blogMap = blogs.map(item => item.likes)

	const favoriteBlog = blogs.find(blog => (Math.max(...blogMap)) === blog.likes)
	return {
		title: favoriteBlog.title,
		author: favoriteBlog.author,
		likes: favoriteBlog.likes
	}
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog
}