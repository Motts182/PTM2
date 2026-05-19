import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import Exercise2 from "@/app/(components)/exercises/Exercise2"

const prices = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]

describe("Exercise2", () => {
  test("renders first and last prices as currency labels", () => {
    render(<Exercise2 steps={prices} />)
    expect(screen.getByText("$1.99")).toBeInTheDocument()
    expect(screen.getByText("$70.99")).toBeInTheDocument()
  })

  test("renders one step marker per price", () => {
    const { container } = render(<Exercise2 steps={prices} />)
    expect(container.querySelectorAll(".bg-gray-400")).toHaveLength(prices.length)
  })

  test("renders nothing when steps is empty", () => {
    const { container } = render(<Exercise2 steps={[]} />)
    expect(container.querySelector(".rounded-full")).toBeNull()
  })

  test("shows server error message when serverError is true", () => {
    render(<Exercise2 steps={[]} serverError />)
    expect(screen.getByText(/No se pudo cargar los valores del servidor/)).toBeInTheDocument()
  })
})
