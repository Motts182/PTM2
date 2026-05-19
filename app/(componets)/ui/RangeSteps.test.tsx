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

  test("promotes dragged handle to z-20 and demotes the other to z-10", () => {
    const { container } = render(
      <Range steps={mockValues} currentMin={0} currentMax={5} onChange={mockOnChange} />
    )
    const [minHandle, maxHandle] = container.querySelectorAll(".rounded-full")

    fireEvent.mouseDown(maxHandle)
    expect(maxHandle).toHaveClass("z-20")
    expect(minHandle).toHaveClass("z-10")
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
    // 40% of 200 = clientX 80 → exactStep = 0.4 * 5 = 2 → closestStep = 2
    fireEvent.mouseMove(document, { clientX: 80 })

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
    // 60% of 200 = clientX 120 → exactStep = 0.6 * 5 = 3 → closestStep = 3
    fireEvent.mouseMove(document, { clientX: 120 })

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
    // 80% of 200 = clientX 160 → exactStep = 0.8 * 5 = 4 > currentMaxIndex(3)
    fireEvent.mouseMove(document, { clientX: 160 })

    expect(mockOnChange).not.toHaveBeenCalled()
  })
})
