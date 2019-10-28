const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
	{
		title: 'The Man in Water',
		author: 'Stephen King',
		url: 'bing.com',
		likes: 4,
		_id: '5db4c0261b585b2ca7be28a3'
	},
	{
		title: 'How to lose Weight',
		author: 'James Mcavoy',
		url: 'google.com',
		likes: 34,
		_id: '5db4c0261b585b2ca7be28a4'
	}
]

beforeEach(async () => {
	await Blog.deleteMany({})

	let blogObject = new Blog(initialBlogs[0])
	await blogObject.save()

	blogObject = new Blog(initialBlogs[1])
	await blogObject.save()
})

test('returns 2 blogs', async() => {
	await api
		.get('/api/blogs')
		.expect(200)

	const response = await api.get('/api/blogs')

	expect(response.body.length).toBe(initialBlogs.length)
})

test('blogs are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', 'application\/json; charset=utf-8')
})

test('returns a property for blog id', async () => {
	const response = await api.get('/api/blogs/')

	expect(response.body[0].id).toBeDefined()
})

test('adds a blog post to the array list', async () => {
	const newBlog = {
		title: 'It',
		author: 'Stephen King',
		url: 'google.com',
		likes: 30
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(200)
		.expect('Content-Type', 'application\/json; charset=utf-8')

	const response = await api.get('/api/blogs')
	const author = response.body.map(r => r.author)

	expect(response.body.length).toBe(initialBlogs.length + 1)
	expect(author).toContain('Stephen King')
})

test('blog without likes defaults to 0', async () => {
	const newBlog = {
		title: 'test',
		author: 'Chris Sanders',
		url: 'google.com',
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(200)

	const response = await api.get('/api/blogs')

	expect(response.body[initialBlogs.length].likes).toBe(0)
	expect(response.body.length).toBe(initialBlogs.length + 1)
})

test('blog without title or url is not added', async () => {
	const newBlog = {
		author: 'Chris Sanders',
		likes: 0
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(400)

	const response = await api.get('/api/blogs')

	expect(response.body.length).toBe(initialBlogs.length)
})

test('deletes a single blog', async () => {
	await api
		.delete('/api/blogs/5db4c0261b585b2ca7be28a3')
		.expect(204)


	const response = await api.get('/api/blogs')

	expect(response.body.length).toBe(initialBlogs.length - 1)
})


test('adds likes to a post', async () => {
	const updatedBlog = {
		likes: 100
	}

	await api
		.put('/api/blogs/5db4c0261b585b2ca7be28a4')
		.send(updatedBlog)
		.expect(200)

	const response = await api.get('/api/blogs')

	expect(response.body[1].likes).toBe(100)

})

afterAll(() => {
	mongoose.connection.close()
})