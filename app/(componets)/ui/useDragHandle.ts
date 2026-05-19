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

  const startTouch = (isMin: boolean) => {
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX, isMin)
    const onTouchEnd = () => {
      document.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("touchend", onTouchEnd)
    }
    document.addEventListener("touchmove", onTouchMove)
    document.addEventListener("touchend", onTouchEnd)
  }

  return { startDrag, startTouch }
}
