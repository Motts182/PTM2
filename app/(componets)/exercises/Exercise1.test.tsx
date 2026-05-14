import { render, screen, waitFor } from "@testing-library/react"
import Exercise1 from "@/app/(componets)/exercises/Exercise1" // Ajustá la ruta

// Mockear el fetch global de la API
global.fetch = jest.fn()

describe("Componente Exercise1 (Integration Test)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("You need to call the mock API, set the limits, and integrate the Range", async () => {
    // Simulamos una respuesta exitosa del servidor mock
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ min: 10, max: 150 }),
    })

    render(<Exercise1 />)

    // Verificamos que se llame al endpoint correcto
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/exercise1")

    // Esperamos a que los datos se impacten en el DOM (vía useEffect)
    await waitFor(() => {
      expect(screen.getByText("10")).toBeInTheDocument()
    })
    expect(screen.getByText("150")).toBeInTheDocument()
  })
})