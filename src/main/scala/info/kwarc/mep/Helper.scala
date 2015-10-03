package info.kwarc.mep

import info.kwarc.mmt.api._


class convertErrors {
  /**
   * @param error Error Error to convert to xml
   * @return XML presentation of the error
   */
  def toXML(error: Error): scala.xml.Elem = {
    error match {
      case e:SourceError =>
        <error level={e.level.toString} srcref={e.ref.toString}>
          <shortmsg>{e.toString()}</shortmsg>
          <longmsg>{e.extraMessage.toString}</longmsg>
        </error>
      case e:Error =>  
        <error level={e.level.toString}>
          <shortmsg>{e.toString()}</shortmsg>
          <longmsg>{e.extraMessage.toString}</longmsg>
        </error>  
    }
  }
  
  /**
   * @param errors List[Error] Errors to convert to xml
   * @return XML presentation of errors
   */
  def toXML(errors : List[Error]): scala.xml.Elem = {
    <errors>{errors.map { error => toXML(error) }}</errors>
  }
}
