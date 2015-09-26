var JOBAD1, JOBAD_element;
jQuery(function(){ //run this code once the DOM is ready
    JOBAD_element = $("#presenter")[0]; // some area of the page to bind JOBAD to. Warning: Never bind to "body" or "document" directly. 
    JOBAD1 = new JOBAD(JOBAD_element); //create a new jobad instance. 
    //load the module some.awesome.module.name
    JOBAD1.modules.load('mathjax.mathjax', [], []); //setup jobad (start it)
    JOBAD1.Setup(); 
});