import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog

  test('renders title and author but not url and number of likes', () => {
    blog = {
      title: 'Esimerkkiblogi',
      author: 'Esi Merkki',
      url: 'esimerk.ki',
      likes: 3131,
      user: {
        username: 'esim',
        name:'Esim Erkki'
      }
    }

    const component = render(
      <Blog blog={blog} />
    )

    expect(component.container).toHaveTextContent(
      'Esimerkkiblogi Esi Merkki'
    )
    const urlElement = component.getByText('esimerk.ki')
    expect(urlElement).not.toBeVisible()

    const likeElement = component.getByText('like')
    expect(likeElement).not.toBeVisible()
  })

  test('renders also url and likes when view is clicked', async () => {
    blog = {
      title: 'Esimerkkiblogi',
      author: 'Esi Merkki',
      url: 'esimerk.ki',
      likes: 3131,
      user: {
        username: 'esim',
        name:'Esim Erkki'
      }
    }

    const mockHandler = jest.fn()

    const component = render(
      <Blog blog={blog} hideWhenVisible={mockHandler} />
    )

    const button = component.container.querySelector('button')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(
      'Esimerkkiblogi Esi Merkki'
    )

    expect(component.container).toHaveTextContent(
      'esimerk.ki'
    )

    expect(component.container).toHaveTextContent(
      'likes 3131'
    )
  })

  test('clicking like-button twice calls event handler twice', () => {
    blog = {
      title: 'Esimerkkiblogi',
      author: 'Esi Merkki',
      url: 'esimerk.ki',
      likes: 3131,
      user: {
        username: 'esim',
        name:'Esim Erkki'
      }
    }

    const mockHandler = jest.fn()

    const component = render(
      <Blog blog={blog} handleLike={mockHandler} />
    )

    const button = component.container.querySelector('.likeButton')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})