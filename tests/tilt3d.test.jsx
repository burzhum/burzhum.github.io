import { render, screen } from '@testing-library/react'
import Tilt3D from '../src/components/Tilt3D'

test('renders children inside tilt wrapper', () => {
  render(<Tilt3D testId="tilt"><p>hello</p></Tilt3D>)
  expect(screen.getByText('hello')).toBeInTheDocument()
  expect(screen.getByTestId('tilt').className).toMatch(/group\/tilt/)
})

test('glare layer is aria-hidden', () => {
  render(<Tilt3D testId="tilt-glare" glare><p>card</p></Tilt3D>)
  const wrapper = screen.getByTestId('tilt-glare')
  expect(wrapper.querySelector('[aria-hidden="true"]')).not.toBeNull()
})
