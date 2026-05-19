import Range from "@/app/(components)/ui/Range"
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

  test("handles have hover:cursor-grab class", () => {
    const { container } = render(<Range {...defaultProps} />)
    container.querySelectorAll(".rounded-full").forEach((h) =>
      expect(h).toHaveClass("hover:cursor-grab"),
    )
  })

  test("body cursor becomes grabbing while dragging", () => {
    const { container } = render(<Range {...defaultProps} />)
    const [minHandle] = container.querySelectorAll(".rounded-full")
    fireEvent.mouseDown(minHandle)
    expect(document.body.style.cursor).toBe("grabbing")
  })

  test("body cursor resets after drag ends", () => {
    const { container } = render(<Range {...defaultProps} />)
    const [minHandle] = container.querySelectorAll(".rounded-full")
    fireEvent.mouseDown(minHandle)
    fireEvent.mouseUp(document)
    expect(document.body.style.cursor).toBe("")
  })

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

  test("clicking min label shows an input with its current value", () => {
    render(<Range {...defaultProps} />)

    fireEvent.click(screen.getByText("20"))

    expect(screen.getByRole("textbox")).toHaveValue("20")
  })

  test("clicking max label shows an input with its current value", () => {
    render(<Range {...defaultProps} />)

    fireEvent.click(screen.getByText("80"))

    expect(screen.getByRole("textbox")).toHaveValue("80")
  })

  test("pressing Enter on min label input calls onChange with the new value", () => {
    render(<Range {...defaultProps} />)

    fireEvent.click(screen.getByText("20"))
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "30" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(mockOnChange).toHaveBeenCalledWith({ min: 30, max: 80 })
  })

  test("pressing Enter on max label input calls onChange with the new value", () => {
    render(<Range {...defaultProps} />)

    fireEvent.click(screen.getByText("80"))
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "70" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(mockOnChange).toHaveBeenCalledWith({ min: 20, max: 70 })
  })

  test("blurring the input commits the value", () => {
    render(<Range {...defaultProps} />)

    fireEvent.click(screen.getByText("20"))
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "35" } })
    fireEvent.blur(input)

    expect(mockOnChange).toHaveBeenCalledWith({ min: 35, max: 80 })
  })

  test("pressing Escape cancels the edit without calling onChange", () => {
    render(<Range {...defaultProps} />)

    fireEvent.click(screen.getByText("20"))
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "99" } })
    fireEvent.keyDown(input, { key: "Escape" })

    expect(mockOnChange).not.toHaveBeenCalled()
    expect(screen.getByText("20")).toBeInTheDocument()
  })

  test("shows error when typed min value would reach or exceed max", () => {
    render(<Range {...defaultProps} />)

    fireEvent.click(screen.getByText("20"))
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "90" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(mockOnChange).not.toHaveBeenCalled()
    expect(screen.getByText(/El valor mínimo debe ser menor que el máximo/)).toBeInTheDocument()
  })

  test("shows error when typed max value would reach or go below min", () => {
    render(<Range {...defaultProps} />)

    fireEvent.click(screen.getByText("80"))
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "10" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(mockOnChange).not.toHaveBeenCalled()
    expect(screen.getByText(/El valor máximo debe ser mayor que el mínimo/)).toBeInTheDocument()
  })

  test("shows error and does not call onChange when typed min value is below minLimit", () => {
    render(<Range {...defaultProps} />)

    fireEvent.click(screen.getByText("20"))
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "-50" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(mockOnChange).not.toHaveBeenCalled()
    expect(screen.getByText(/El valor mínimo permitido es 0/)).toBeInTheDocument()
  })

  test("shows error and does not call onChange when typed max value exceeds maxLimit", () => {
    render(<Range {...defaultProps} />)

    fireEvent.click(screen.getByText("80"))
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "150" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(mockOnChange).not.toHaveBeenCalled()
    expect(screen.getByText(/El valor máximo permitido es 100/)).toBeInTheDocument()
  })
})
