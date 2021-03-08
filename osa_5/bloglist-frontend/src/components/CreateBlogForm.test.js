import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CreateBlogForm from './CreateBlogForm'

test('<CreateBlogForm /> updates parents state and calls onSubmit', () => {
  const newBlog = jest.fn()

  const component = render(
    <CreateBlogForm newBlog={newBlog} />
  )

  const titleInput = component.container.querySelector('#title')
  const authorInput = component.container.querySelector('#author')
  const urlInput = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(titleInput, {
    target: { value: 'testing of forms could be easier' }
  })
  fireEvent.change(authorInput, {
    target: { value: 'Esi Merkki' }
  })
  fireEvent.change(urlInput, {
    target: { value: 'esimerk.ki' }
  })
  fireEvent.submit(form)

  expect(newBlog.mock.calls).toHaveLength(1)
  expect(newBlog.mock.calls[0][0].title).toBe('testing of forms could be easier')
  expect(newBlog.mock.calls[0][0].author).toBe('Esi Merkki')
  expect(newBlog.mock.calls[0][0].url).toBe('esimerk.ki')
})