import Exercise2 from "@/app/(componets)/exercises/Exercise2"
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"

global.fetch = jest.fn()

describe("Componente Exercise2 (Integration Test)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("You need to call the mock API, set the fixed prices, and initialize the RangeSteps.", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
      }),
    })

    render(<Exercise2 />)

    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/exercise2")

    await waitFor(() => {
      expect(screen.getByText("$1.99")).toBeInTheDocument()
    })
    expect(screen.getByText("$70.99")).toBeInTheDocument()
  })

  test("It handles gracefully if the API returns an empty array.", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ rangeValues: [] }),
    })

    render(<Exercise2 />)

    await waitFor(() => {
      expect(screen.queryByText("$1.99")).not.toBeInTheDocument()
    })
  })
})
