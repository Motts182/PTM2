import Range from "@/app/(componets)/ui/Range"
import { render, screen, fireEvent } from "@testing-library/react"

describe("Componente Range (Unit Tests)", () => {
  const mockOnChange = jest.fn()
  const defaultProps = {
    minLimit: 0,
    maxLimit: 100,
    currentMin: 20,
    currentMax: 80,
    onChange: mockOnChange,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("You must render the current values ​​on the screen", () => {
    render(<Range {...defaultProps} />)

    expect(screen.getByText("20")).toBeInTheDocument()
    expect(screen.getByText("80")).toBeInTheDocument()
  })

  test("You must apply the z-index classes dynamically when you mouse down", () => {
    const { container } = render(<Range {...defaultProps} />)

    const handles = container.querySelectorAll(".rounded-full")
    const minHandle = handles[0]
    const maxHandle = handles[1]

    expect(minHandle).toHaveClass("z-10")
    expect(maxHandle).toHaveClass("z-10")

    fireEvent.mouseDown(minHandle)
    expect(minHandle).toHaveClass("z-20")

    fireEvent.mouseDown(maxHandle)
    expect(maxHandle).toHaveClass("z-20")
    expect(minHandle).toHaveClass("z-10")
  })
})
