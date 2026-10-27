import { fireEvent, render, screen } from '@testing-library/preact'
import { describe, expect, it } from 'vitest'
import App from './app'

describe('interactive course shell', () => {
  it('renders seven modules and reacts to navigation with isolated lab state', () => {
    render(<App />)
    expect(screen.getByText('Foundations & HTTP Pipeline')).toBeTruthy()
    expect(screen.getByText(/Explored/)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Previous Lesson' }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByRole('button', { name: 'Previous Module' }).hasAttribute('disabled')).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: /02\. DI, Routing & DTO Mapping/ }))
    expect(screen.getByText('MODULE 02')).toBeTruthy()
    expect(screen.getByText(/Explored/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /02\. DI, Routing & DTO Mapping/ }))
    expect(screen.getByText(/Explored/).textContent?.replace(/\s/g, '')).toContain('Explored2of7')

    fireEvent.click(screen.getByRole('button', { name: 'Previous Lesson' }))
    expect(screen.getByText('MODULE 01')).toBeTruthy()
    expect(screen.getByText(/Explored/).textContent?.replace(/\s/g, '')).toContain('Explored2of7')

    fireEvent.click(screen.getByRole('button', { name: 'Next Module' }))
    expect(screen.getByText('MODULE 02')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Next Lesson' }))
    expect(screen.getByText('MODULE 03')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Previous Module' }))
    expect(screen.getByText('MODULE 02')).toBeTruthy()
    expect(screen.getByText(/Explored/).textContent?.replace(/\s/g, '')).toContain('Explored3of7')
  })

  it('does not share state across mounted app instances', () => {
    const firstContainer = document.body.appendChild(document.createElement('div'))
    const secondContainer = document.body.appendChild(document.createElement('div'))
    const first = render(<App />, { container: firstContainer })
    const second = render(<App />, { container: secondContainer })
    fireEvent.click(first.getByRole('button', { name: /02\. DI, Routing & DTO Mapping/ }))
    expect(first.getByText('MODULE 02')).toBeTruthy()
    expect(second.getByText('MODULE 01')).toBeTruthy()
  })

  it('resets local lab controls after remount while preserving unique progress', () => {
    render(<App />)
    const controllers = screen.getByLabelText(/Use controllers/) as HTMLInputElement
    fireEvent.click(controllers)
    expect(controllers.checked).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: /02\. DI, Routing & DTO Mapping/ }))
    fireEvent.click(screen.getByRole('button', { name: /01\. Foundations & HTTP Pipeline/ }))
    expect((screen.getByLabelText(/Use controllers/) as HTMLInputElement).checked).toBe(false)
    expect(screen.getByText(/Explored/).textContent?.replace(/\s/g, '')).toContain('Explored2of7')
    expect(screen.getByRole('button', { name: /01\. Foundations & HTTP Pipeline/ }).getAttribute('aria-current')).toBe('page')
  })
})
