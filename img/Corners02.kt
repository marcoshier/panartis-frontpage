
import org.openrndr.application
import org.openrndr.color.ColorRGBa
import org.openrndr.draw.LineJoin
import org.openrndr.draw.isolated
import org.openrndr.extra.gui.GUI
import org.openrndr.extra.gui.addTo
import org.openrndr.extra.parameters.DoubleListParameter
import org.openrndr.extra.parameters.DoubleParameter
import org.openrndr.extra.parameters.IntParameter
import org.openrndr.extra.shadestyles.radialGradient
import org.openrndr.extra.shapes.operators.arcCorners
import org.openrndr.extra.shapes.operators.bulgeSegments
import org.openrndr.extra.shapes.regularStar

fun main() {
    application {
        configure {
            width = 800
            height = 800
        }
        program {
            val gui = GUI()
            val settings = object {
                @IntParameter("point count", 3, 100, order = 0)
                var pointCount = 10

                @DoubleParameter("inner radius", 10.0, 200.0, order = 1)
                var innerRadius = 10.0

                @DoubleParameter("outer radius", 10.0, 400.0, order = 2)
                var outerRadius = 100.0

                @DoubleListParameter("chamfer lengths", 0.0, 50.0, order = 3)
                var lengths = mutableListOf(1.0)

                @DoubleListParameter("chamfer expands", -1.0, 1.0, order = 4)
                var expands = mutableListOf(0.0)

                @DoubleListParameter("arc scales", order = 5)
                var scales = mutableListOf(0.5)

                @DoubleListParameter("large arcs", order = 6)
                var largeArcs = mutableListOf(0.0)

                @DoubleListParameter("distortion", -50.0, 50.0)
                var distortion = mutableListOf(0.0)
            }.addTo(gui)

            extend(gui)
            extend {
                drawer.background(ColorRGBa.GRAY)
                drawer.stroke = ColorRGBa.BLACK
                drawer.fill = null
                drawer.fill = ColorRGBa.WHITE
                drawer.shadeStyle = radialGradient(ColorRGBa.PINK, ColorRGBa.RED, length = 0.3)

                drawer.isolated {
                    val c = regularStar(settings.pointCount, settings.innerRadius, settings.outerRadius)
                    drawer.translate(drawer.bounds.center)
                    drawer.strokeWeight = 1.0
                    drawer.stroke = ColorRGBa.BLACK.opacify(0.5)
                    drawer.lineJoin = LineJoin.ROUND

                    val b = c.arcCorners(
                        lengths = settings.lengths,
                        expands = settings.expands,
                        scales = settings.scales,
                        largeArcs = settings.largeArcs.map { it > 0.0 })

                    val d = b.bulgeSegments(settings.distortion)

                    drawer.contour(d)

                }
            }
        }
    }
}