/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// check what next does to it
// why do we need toJSON()

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({}).populate('user', { username: 1, name: 1 })
	try {
		response.json(blogs.map(blog => blog.toJSON()))
	} catch (exception) {
		next(exception)
	}
})

blogsRouter.get('/:id', async (request, response, next) => {
	const blog = await Blog.findById(request.params.id)

	try {
		if (blog) {
			response.json(blog.toJSON())
		} else {
			response.status(404).end()
		}

	} catch (error) {
		next(error)
	}
})

blogsRouter.post('/', async (request, response, next) => {
	const body = request.body

	try {
		const decodedToken = jwt.verify(request.token, process.env.SECRET)
		if (!request.token || !decodedToken.id)
			return response.status(401).json({ error: 'token missing or invalid' })

		const user = await User.findById(decodedToken.id)

		const blog = new Blog({
			title: body.title,
			author: body.author,
			url: body.url,
			likes: body.likes,
			user: user._id
		})

		const savedBlog = await blog.save()
		user.blogs = user.blogs.concat(savedBlog._id)
		await user.save()
		response.json(savedBlog.toJSON())
	} catch (exception){
		next(exception)
	}
})

blogsRouter.delete('/:id', async (request, response, next) => {
	try {
		const blog = await Blog.findById(request.params.id)
		const decodedToken = jwt.verify(request.token, process.env.SECRET)

		if (!request.token || !decodedToken.id)
			return response.status(401).json({ error: 'token missing or invalid' })
		if (blog.user.toString() !== decodedToken.id)
			return response.status(403).json({ error: 'improper id for deletion' })

		await Blog.findByIdAndRemove(request.params.id)
		response.status(204).end()
	} catch (exception) {
		next(exception)
	}
})

blogsRouter.put('/:id', async (request, response, next) => {
	const body = request.body

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	}

	try {
		const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
		response.json(updatedBlog.toJSON())
	} catch (exception) {
		next(exception)
	}
})

module.exports = blogsRouter