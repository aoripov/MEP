var XML = {
   // helper function to produce xml attributes: key="value"
	attr : function (key, value) {return ' ' + key + '="' + value + '"';},
	// helper function to produce xml elements with 0-2 attributes:
	// <tag key1="value1" key2="value">content</tag>
	// all arguments except tag can be null
	elem : function (tag, content, key1, value1, key2, value2) {
		var att1 = (key1 == null) ? "" : this.attr(key1,value1);
		var att2 = (key2 == null) ? "" : this.attr(key2,value2);
		var atts = att1 + att2;
		var begin = '<' + tag + atts;
		if (content == null) {
			return begin + '/>';
		} else {
			return begin + '>' + content + '</' + tag + '>';
		}
	},
};

/**
 * Functions to query for presentation
 */
var mepq = {
	base_url : function() {
		return document.location.origin;
	},

	queryURL : function(path) {
		return this.base_url() + path;
	},

	exec: function(q, cont) {
		var qURL = this.queryURL('/query');
		$.ajax({
			url:qURL,
			type:'POST',
			data:{data: q},
		}).done(cont);
	},
};


var controlPanel = {
	getTextFormat: function() {
		return $("#text-type").val();
	},

	getPresentation: function() {
		var text = XML.elem(this.getTextFormat(), $("#input").val());
		cont = function(result) {$("#presenter").html(result);};
		mepq.exec(text,cont);
		// in case Chrome and MathJax defined regenerate MathML
		if (typeof MathJax != 'undefined') {
			setTimeout(function() {MathJax.Hub.Queue(["Typeset",MathJax.Hub, "presenter"]);}, 500);
		}
	},
};


/**
 * @param from string Class to toggle from
 * @param to string Class to toggle to
 */
$.fn.toggleClasses = function(from, to) {
	if (this.hasClass(from)) {
		this.removeClass(from);
		this.addClass(to);
	} else if (this.hasClass(to)) {
		this.removeClass(to);
		this.addClass(from);
	}
};

/**
 * Funtionality of full width buttons
 */
function fullWidth() {
	$("#editor-window").toggleClasses("col-md-6", "col-md-12");
	$("#presenter-window").toggleClasses("col-md-6", "col-md-12");
	$('.fl-width').children('.glyphicon').toggleClasses("glyphicon-chevron-right", "glyphicon-chevron-left");
}

function hidePanel(panel_body, me) {
	$(panel_body).collapse('toggle');
	me.children('.glyphicon').toggleClasses("glyphicon-chevron-up", "glyphicon-chevron-down");
}