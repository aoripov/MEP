package info.kwarc.mep

import info.kwarc.mmt.api._
import info.kwarc.mmt.api.frontend._
import info.kwarc.mmt.api.presentation._
import info.kwarc.mmt.api.archives._

import info.kwarc.mmt.oeis._

class MMTBackend {
  val controller = new Controller()
  controller.extman.addExtension("info.kwarc.mmt.oeis.OEISImporter", List("/home/akbar/MMT/src/mmt-oeis/resources/dictionary"))
  controller.extman.addExtension("info.kwarc.mmt.planetary.PlanetaryPresenter", Nil)
  controller.extman.addExtension("info.kwarc.mmt.oeis.OEISPresenter", Nil)
  
  /**
   * @param text Text to parse
   * @param format Text format
   * @param presenter Presenter for output
   */
  def getPresentation(text : String, format : String, presenter : String = "oeis-pres") : String = try {
    val comp = controller.extman.get(classOf[OEISImporter]).find{
        _.isApplicable(format)
      }.getOrElse(throw new Exception("No importer found"))    
    
    val pres = controller.extman.get(classOf[Presenter]).find{
        _.isApplicable(presenter)
      }.getOrElse(throw new Exception("No presenter found"))
    
    val dpath = Path.parseD("http://oeis.org/new", NamespaceMap.empty)
    val errHandler = new ErrorContainer(None)
    val doc = comp.translateText(text)(dpath, errHandler)
    
    val rb = new StringBuilder
    pres(doc)(rb)
    rb.get
  } catch {
    case e : Exception => e.getMessage + "\n" + e.getStackTraceString
  }
  
}

