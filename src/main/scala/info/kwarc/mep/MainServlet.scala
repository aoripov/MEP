package info.kwarc.mep

import org.scalatra._
import scalate.ScalateSupport

class MainServlet extends MepStack {

  get("/") {
  	contentType="text/html"
    jade("/index", "layout" -> "WEB-INF/templates/layouts/default.jade", "title" -> "Main | MEP")
  }

}
