import Exercise2 from "@/app/(componets)/exercises/Exercise2"
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"

// Mockeamos el fetch global de la API
global.fetch = jest.fn()

describe("Componente Exercise2 (Integration Test)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("You need to call the mock API, set the fixed prices, and initialize the RangeSteps.", async () => {
    // Simulamos la respuesta exacta que pide la consigna: { rangeValues: [...] }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
      }),
    })

    render(<Exercise2 />)

    // Validamos que le pegue al endpoint correcto del mock server
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/exercise2")

    // Esperamos a que los datos impacten en el estado y se reflejen en los labels
    // El mínimo debería ser el primer elemento ($1.99) y el máximo el último ($70.99)
    await waitFor(() => {
      expect(screen.getByText("$1.99")).toBeInTheDocument()
    })
    expect(screen.getByText("$70.99")).toBeInTheDocument()
  })

  test("It handles gracefully if the API returns an empty array.", async () => {
    // Simulamos un caso borde donde la API no trae datos correctamente
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ rangeValues: [] }),
    })

    render(<Exercise2 />)

    // Al no haber valores, el componente RangeSteps retorna null, por ende no debería haber etiquetas de precio
    await waitFor(() => {
      expect(screen.queryByText("$1.99")).not.toBeInTheDocument()
    })
  })
})