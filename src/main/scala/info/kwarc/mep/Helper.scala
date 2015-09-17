package info.kwarc.mep

import info.kwarc.mmt.api._


class convertErrors {
  /**
   * @param error Error Error to convert to xml
   * @return XML presentation of the error
   */
  def toXML(error: Error): scala.xml.Elem = {
    <error level={error.level.toString} srcref={""}>
			<shortmsg>{error.toString()}</shortmsg>
			<longmsg>{error.extraMessage}</longmsg>
		</error>  
  }
  
  /**
   * @param errors List[Error] Errors to convert to xml
   * @return XML presentation of errors
   */
  def toXML(errors : List[Error]): scala.xml.Elem = {
    <errors>{errors.map { error => toXML(error) }}</errors>
  }
}
