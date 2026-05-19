import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import Exercise1 from "@/app/(components)/exercises/Exercise1"

describe("Exercise1", () => {
  test("renders valor mínimo/máximo seteado labels from props", () => {
    render(<Exercise1 min={10} max={150} />)
    expect(screen.getByText(/Valor mínimo seteado/)).toBeInTheDocument()
    expect(screen.getByText(/Valor máximo seteado/)).toBeInTheDocument()
  })

  test("shows server error banner when serverError is true", () => {
    render(<Exercise1 min={1} max={100} serverError />)
    expect(screen.getByText(/No se pudo conectar al servidor/)).toBeInTheDocument()
  })

  test("renders two drag handles", () => {
    const { container } = render(<Exercise1 min={0} max={100} />)
    expect(container.querySelectorAll(".rounded-full")).toHaveLength(2)
  })
})
