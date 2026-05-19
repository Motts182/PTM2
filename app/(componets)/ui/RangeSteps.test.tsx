import Range from "@/app/(componets)/ui/Range"
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"

describe("Componente Range con steps (Unit Tests)", () => {
  const mockOnChange = jest.fn()
  const mockValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]

  test("You must render the labels formatted as currency", () => {
    render(
      <Range
        steps={mockValues}
        currentMin={1}
        currentMax={4}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText("$5.99")).toBeInTheDocument()
    expect(screen.getByText("$50.99")).toBeInTheDocument()
  })

  test("You must change the priority z-index when clicking a handle", () => {
    const { container } = render(
      <Range
        steps={mockValues}
        currentMin={0}
        currentMax={5}
        onChange={mockOnChange}
      />
    )

    const handles = container.querySelectorAll(".rounded-full")
    const minHandle = handles[0]
    const maxHandle = handles[1]

    fireEvent.mouseDown(maxHandle)
    expect(maxHandle).toHaveClass("z-20")
    expect(minHandle).toHaveClass("z-10")
  })
})
