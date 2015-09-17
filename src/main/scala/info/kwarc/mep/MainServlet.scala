package info.kwarc.mep

import org.scalatra._
import scalate.ScalateSupport
import info.kwarc.mmt.api._


class MainServlet extends MepStack {

  val backend = new MMTBackend()
  val convertErrors = new convertErrors()
  
  get("/") {
  	contentType="text/html"
    jade("/index", "layout" -> "WEB-INF/templates/layouts/default.jade", "title" -> "Main | MEP")
  }

  post("/query") {
  	val response = scala.xml.XML.loadString(params("data"));
  	contentType="html"
  	response match {
  		case <oeis>{content}</oeis> =>
        var (pres, errors) = backend.getPresentation(content.toString, "oeis-omdoc")
        errors.sortWith(_.level > _.level)
        <result>
					<presentation>{scala.xml.XML.loadString(pres)}</presentation>{convertErrors.toXML(errors)}
				</result>
  		case r => <b>No presentation {r}</b>
  	}
  }


}
