import { fireEvent, render, screen } from '@testing-library/preact'
import { describe, expect, it, vi } from 'vitest'

function ActionButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}>Ready</button>
  )
}

describe('Preact test setup', () => {
  it('renders and handles an interaction', () => {
    const onClick = vi.fn()
    render(<ActionButton onClick={onClick} />)
    const button = screen.getByRole('button')
    expect(button.textContent).toBe('Ready')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })
})
