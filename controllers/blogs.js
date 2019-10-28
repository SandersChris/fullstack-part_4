/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// check what next does 
// why do we need toJSON()

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs.map(blog => blog.toJSON()))
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

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	})

	try {
		const savedBlog = blog.save()
		response.json(savedBlog.toJSON())
	} catch (exception){
		next(exception)
	}
})

blogsRouter.delete('/:id', async (request, response, next) => {
	try {
		Blog.findByIdAndRemove(request.params.id)
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
		const updatedBlog = Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
		response.json(updatedBlog.toJSON())

	} catch (exception) {
		next(exception)
	}
})

module.exports = blogsRouter