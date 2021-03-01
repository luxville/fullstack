import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (blog) => {//id, newObject
  //const request = axios.put(`${baseUrl}/${id}`, newObject)
  //return request.then(response => response.data)
  const config = {
    headers: { Authorization: token }//`Bearer ${token}` }
  }
  console.log('yksi')
  const blogToUpdate = {
    user: blog.user.id,
    likes: blog.likes + 1,
    author: blog.author,
    title: blog.title,
    url: blog.url
  }

  const response = await axios.put(`${baseUrl}/${blog.id}`, blogToUpdate, config)
  console.log('toinen yksi')
  return response.data
}

const remove = (id) => {
  const config = {
    headers: { Authorization: token }
  }

  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.data)
}

/*const blogs = getAll
const created = create
const updated = update
const sToken = setToken

export default { blogs, created, updated, sToken }*/
export default { setToken, getAll, create, update, remove }