package info.kwarc.mep

import org.scalatra._
import scalate.ScalateSupport

class MainServlet extends MepStack {

  val backend = new MMTBackend()
  
  get("/") {
  	contentType="text/html"
    jade("/index", "layout" -> "WEB-INF/templates/layouts/default.jade", "title" -> "Main | MEP")
  }

  post("/query") {
  	val response = scala.xml.XML.loadString(params("data"));
  	contentType="html"
  	response match {
  		case <oeis>{content}</oeis> =>
        
        val pres = backend.getPresentation(content.toString, "oeis-omdoc")   
        pres
  		case r => <b>No presentation {r}</b>
  	}
  }


}
