import { render, screen, waitFor } from "@testing-library/react"
import Exercise1 from "@/app/(componets)/exercises/Exercise1"

global.fetch = jest.fn()

describe("Componente Exercise1 (Integration Test)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("You need to call the mock API, set the limits, and integrate the Range", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ min: 10, max: 150 }),
    })

    render(<Exercise1 />)

    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/exercise1")

    await waitFor(() => {
      expect(screen.getByText("10")).toBeInTheDocument()
    })
    expect(screen.getByText("150")).toBeInTheDocument()
  })
})
