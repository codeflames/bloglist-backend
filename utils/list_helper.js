var _ = require('lodash')

const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  // go through the blogs and find the one with the most likes
  // return that blog
  // if there are no blogs, return null
  if (blogs.length === 0) {
    return null
  }
  const reducer = (max, item) => {
    return max.likes > item.likes ? max : item
  }
  return blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
  // go through the blogs and find the author with the most blogs
  // return that author and the number of blogs
  // if there are no blogs, return null
  if (blogs.length === 0) {
    return null
  }
  // using lodash library
  const author = _.maxBy(blogs, 'author')
  const authorBlogs = _.filter(blogs, { 'author': author.author })
  return {
    author: author.author,
    blogs: authorBlogs.length
  }
}

const mostLikes = (blogs) => {
  // go through the blogs and find the author with the most likes
  // return that author and the number of likes
  // if there are no blogs, return null
  if (blogs.length === 0) {
    return null
  }
  // using lodash library
  // find all the authors
  const authors = _.uniq(_.map(blogs, 'author'))
  // for each author, find the total number of likes
  const authorLikes = _.map(authors, (author) => {
    const authorBlogs = _.filter(blogs, { 'author': author })
    const reducer = (sum, item) => {
      return sum + item.likes
    }
    return {
      author: author,
      likes: authorBlogs.reduce(reducer, 0)
    }
  })
  // find the author with the most likes
  const author = _.maxBy(authorLikes, 'likes')
  return author
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}