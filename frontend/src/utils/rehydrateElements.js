import { TOOL_ITEMS } from "../constants"
import {
  createElement,
  getSvgPathFromStroke,
} from "../Components/utils/element"
import getStroke from "perfect-freehand"

export const rehydrateElements = (elements) => {
  return elements.map((el, index) => {
    switch (el.type) {
      case TOOL_ITEMS.BRUSH: {
        const strokePoints = el.points.map((p) => [p.x, p.y])
        const path = new Path2D(getSvgPathFromStroke(getStroke(strokePoints)))
        return { ...el, path }
      }

      case TOOL_ITEMS.TEXT:
        return {
          ...el,
          size: el.size || 24,
          stroke: el.stroke || "#000000",
          font: el.font || "Nanum Pen Script",
        }

      default: {
        const hydrated = createElement(index, el.x1, el.y1, el.x2, el.y2, el)
        return hydrated
      }
    }
  })
}
