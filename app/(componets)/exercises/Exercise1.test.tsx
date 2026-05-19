import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import Exercise1 from "@/app/(componets)/exercises/Exercise1"

describe("Exercise1", () => {
  test("renders the limits passed as props", () => {
    render(<Exercise1 min={10} max={150} />)
    expect(screen.getByText("10")).toBeInTheDocument()
    expect(screen.getByText("150")).toBeInTheDocument()
  })

  test("renders two drag handles", () => {
    const { container } = render(<Exercise1 min={0} max={100} />)
    expect(container.querySelectorAll(".rounded-full")).toHaveLength(2)
  })
})
