import Range from "@/app/(componets)/ui/Range"
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"

const trackRect = {
  left: 0, width: 200, top: 0, height: 4,
  right: 200, bottom: 4, x: 0, y: 0, toJSON: () => {},
}

describe("Range — steps mode", () => {
  const mockOnChange = jest.fn()
  const mockValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]

  beforeEach(() => jest.clearAllMocks())

  test("renders labels formatted as currency", () => {
    render(
      <Range steps={mockValues} currentMin={1} currentMax={4} onChange={mockOnChange} />
    )
    expect(screen.getByText("$5.99")).toBeInTheDocument()
    expect(screen.getByText("$50.99")).toBeInTheDocument()
  })

  test("labels are not editable — clicking them does not open an input", () => {
    render(
      <Range steps={mockValues} currentMin={1} currentMax={4} onChange={mockOnChange} />
    )
    fireEvent.click(screen.getByText("$5.99"))
    expect(screen.queryByRole("textbox")).toBeNull()
  })

  test("promotes dragged handle to z-20 and demotes the other to z-10", () => {
    const { container } = render(
      <Range steps={mockValues} currentMin={0} currentMax={5} onChange={mockOnChange} />
    )
    const [minHandle, maxHandle] = container.querySelectorAll(".rounded-full")

    fireEvent.mouseDown(maxHandle)
    expect(maxHandle).toHaveClass("z-20")
    expect(minHandle).toHaveClass("z-10")
  })

  test("handles have hover:cursor-grab class", () => {
    const { container } = render(
      <Range steps={mockValues} currentMin={0} currentMax={5} onChange={mockOnChange} />
    )
    const handles = container.querySelectorAll(".rounded-full")
    handles.forEach((h) => expect(h).toHaveClass("hover:cursor-grab"))
  })

  test("renders one step marker per value", () => {
    const { container } = render(
      <Range steps={mockValues} currentMin={0} currentMax={5} onChange={mockOnChange} />
    )
    expect(container.querySelectorAll(".bg-gray-400")).toHaveLength(mockValues.length)
  })

  test("returns null when steps array is empty", () => {
    const { container } = render(
      <Range steps={[]} currentMin={0} currentMax={0} onChange={mockOnChange} />
    )
    expect(container.firstChild).toBeNull()
  })

  test("calls onChange with the nearest step index when dragging min handle", () => {
    const { container } = render(
      <Range steps={mockValues} currentMin={0} currentMax={5} onChange={mockOnChange} />
    )
    jest.spyOn(container.querySelector(".bg-gray-600") as Element, "getBoundingClientRect")
      .mockReturnValue(trackRect)

    const [minHandle] = container.querySelectorAll(".rounded-full")
    fireEvent.mouseDown(minHandle)
    fireEvent.mouseMove(document, { clientX: 80 }) // 40% → step 2

    expect(mockOnChange).toHaveBeenCalledWith({ min: 2, max: 5 })
  })

  test("calls onChange with the nearest step index when dragging max handle", () => {
    const { container } = render(
      <Range steps={mockValues} currentMin={0} currentMax={5} onChange={mockOnChange} />
    )
    jest.spyOn(container.querySelector(".bg-gray-600") as Element, "getBoundingClientRect")
      .mockReturnValue(trackRect)

    const maxHandle = container.querySelectorAll(".rounded-full")[1]
    fireEvent.mouseDown(maxHandle)
    fireEvent.mouseMove(document, { clientX: 120 }) // 60% → step 3

    expect(mockOnChange).toHaveBeenCalledWith({ min: 0, max: 3 })
  })

  test("does not call onChange when min handle would reach or exceed max step", () => {
    const { container } = render(
      <Range steps={mockValues} currentMin={0} currentMax={3} onChange={mockOnChange} />
    )
    jest.spyOn(container.querySelector(".bg-gray-600") as Element, "getBoundingClientRect")
      .mockReturnValue(trackRect)

    const [minHandle] = container.querySelectorAll(".rounded-full")
    fireEvent.mouseDown(minHandle)
    fireEvent.mouseMove(document, { clientX: 160 }) // 80% → step 4 > currentMax(3)

    expect(mockOnChange).not.toHaveBeenCalled()
  })
})
