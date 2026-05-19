export function useDragHandle(
  onMove: (clientX: number, isMin: boolean) => void,
) {
  const startDrag = (isMin: boolean) => {
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, isMin)
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  return { startDrag }
}
