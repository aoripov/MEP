package info.kwarc.mep

import org.scalatra._
import scalate.ScalateSupport
import info.kwarc.mmt.api._
import scala.xml.Utility


class MainServlet extends MepStack {

  val backend = new MMTBackend()
  val convertErrors = new convertErrors()
  
  get("/") {
  	contentType="text/html"
    jade("/index", "layout" -> "WEB-INF/templates/layouts/default.jade", "title" -> "Main | MEP")
  }

  post("/api/oeis") {
  	val response = request.body
  	contentType="html"
    var (pres, errors) = backend.getPresentation(response, "oeis-omdoc")
    errors = errors.sortWith((x,y) => x.level > y.level)
    <result>
			<presentation>{scala.xml.XML.loadString(pres)}</presentation>{convertErrors.toXML(errors)}
		</result>
  }


}
