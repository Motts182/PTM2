import Range from "@/app/(componets)/ui/Range"
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"

const trackRect = {
  left: 0, width: 200, top: 0, height: 4,
  right: 200, bottom: 4, x: 0, y: 0, toJSON: () => {},
}

describe("Range — free mode", () => {
  const mockOnChange = jest.fn()
  const defaultProps = {
    minLimit: 0,
    maxLimit: 100,
    currentMin: 20,
    currentMax: 80,
    onChange: mockOnChange,
  }

  beforeEach(() => jest.clearAllMocks())

  test("renders min and max values", () => {
    render(<Range {...defaultProps} />)
    expect(screen.getByText("20")).toBeInTheDocument()
    expect(screen.getByText("80")).toBeInTheDocument()
  })

  test("promotes dragged handle to z-20 and demotes the other to z-10", () => {
    const { container } = render(<Range {...defaultProps} />)
    const [minHandle, maxHandle] = container.querySelectorAll(".rounded-full")

    expect(minHandle).toHaveClass("z-10")
    expect(maxHandle).toHaveClass("z-10")

    fireEvent.mouseDown(minHandle)
    expect(minHandle).toHaveClass("z-20")

    fireEvent.mouseDown(maxHandle)
    expect(maxHandle).toHaveClass("z-20")
    expect(minHandle).toHaveClass("z-10")
  })

  test("calls onChange with computed value when dragging min handle", () => {
    const { container } = render(<Range {...defaultProps} />)
    jest.spyOn(container.querySelector(".bg-gray-600") as Element, "getBoundingClientRect")
      .mockReturnValue(trackRect)

    const [minHandle] = container.querySelectorAll(".rounded-full")
    fireEvent.mouseDown(minHandle)
    fireEvent.mouseMove(document, { clientX: 50 }) // 25% → value 25

    expect(mockOnChange).toHaveBeenCalledWith({ min: 25, max: 80 })
  })

  test("calls onChange with computed value when dragging max handle", () => {
    const { container } = render(<Range {...defaultProps} />)
    jest.spyOn(container.querySelector(".bg-gray-600") as Element, "getBoundingClientRect")
      .mockReturnValue(trackRect)

    const maxHandle = container.querySelectorAll(".rounded-full")[1]
    fireEvent.mouseDown(maxHandle)
    fireEvent.mouseMove(document, { clientX: 120 }) // 60% → value 60

    expect(mockOnChange).toHaveBeenCalledWith({ min: 20, max: 60 })
  })

  test("does not call onChange when min handle would exceed max", () => {
    const { container } = render(<Range {...defaultProps} />)
    jest.spyOn(container.querySelector(".bg-gray-600") as Element, "getBoundingClientRect")
      .mockReturnValue(trackRect)

    const [minHandle] = container.querySelectorAll(".rounded-full")
    fireEvent.mouseDown(minHandle)
    fireEvent.mouseMove(document, { clientX: 180 }) // 90% → value 90 > currentMax(80)

    expect(mockOnChange).not.toHaveBeenCalled()
  })

  test("does not call onChange when max handle would go below min", () => {
    const { container } = render(<Range {...defaultProps} />)
    jest.spyOn(container.querySelector(".bg-gray-600") as Element, "getBoundingClientRect")
      .mockReturnValue(trackRect)

    const maxHandle = container.querySelectorAll(".rounded-full")[1]
    fireEvent.mouseDown(maxHandle)
    fireEvent.mouseMove(document, { clientX: 10 }) // 5% → value 5 < currentMin(20)

    expect(mockOnChange).not.toHaveBeenCalled()
  })

  test("calls onChange on touch drag", () => {
    const { container } = render(<Range {...defaultProps} />)
    jest.spyOn(container.querySelector(".bg-gray-600") as Element, "getBoundingClientRect")
      .mockReturnValue(trackRect)

    const [minHandle] = container.querySelectorAll(".rounded-full")
    fireEvent.touchStart(minHandle)
    const touchMove = new Event("touchmove") as TouchEvent
    Object.defineProperty(touchMove, "touches", { value: [{ clientX: 100 }] })
    document.dispatchEvent(touchMove)

    expect(mockOnChange).toHaveBeenCalledWith({ min: 50, max: 80 })
  })

  test("removes mouse listeners after mouseup", () => {
    const { container } = render(<Range {...defaultProps} />)
    jest.spyOn(container.querySelector(".bg-gray-600") as Element, "getBoundingClientRect")
      .mockReturnValue(trackRect)

    const [minHandle] = container.querySelectorAll(".rounded-full")
    fireEvent.mouseDown(minHandle)
    fireEvent.mouseUp(document)
    fireEvent.mouseMove(document, { clientX: 50 })

    expect(mockOnChange).not.toHaveBeenCalled()
  })
})
