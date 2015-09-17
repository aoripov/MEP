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
 * Functions to query for presentation and errors
 */
var mepq = {
	base_url : function() {
		return document.location.origin;
	},

	queryURL : function(path) {
		return this.base_url() + path;
	},

	/**
	 * @param q string Data to post
	 * @param cont fuction Function to process server response
	 */ 
	exec: function(q, cont) {
		var qURL = this.queryURL('/query');
		$.ajax({
			url:qURL,
			type:'POST',
			data:{data: q},
		}).done(cont);
	},

	/**
	 * @param response string Errors and presentation as XML
	 * @return object Object with presentation and errors
	 */
	parseServerResponse : function(response) {
		var pres = $(response).find("presentation").first().html();
		var errors = $(response).find("error");
		var out = {};
		console.log(response);
		out['presentation'] = pres;
		out['errors'] = '<ul>';
		$.each(errors, function(key, error) {
			out['errors'] += '<li>';
			var level = $(error).attr('level');
			var srcref = $(error).attr('srcref');
			var shortmsg = $(error).find('shortmsg').html();
			out['errors'] += '<p>';
			out['errors'] += XML.elem('u', 
				typeof mepq.error_map[level] != 'undefined' ? mepq.error_map[level] : 'Info', 
				'style', 
				'color:' + (typeof mepq.color_map[level] != 'undefined' ? mepq.color_map[level] : '#9999FF')
			);
			out['errors'] += " " + shortmsg;
			out['errors'] += '</p>';
			out['errors'] += '</li>';
		});	
		out['errors'] += '</ul>';
		console.log(out);
		return out;
	},

	color_map : {
		'0' : '#9999FF', 
		'1' : "#BBBB11", 
		'2' : "#FF6666", 
		'3' : "#FF2222",
	},

	error_map : {
		'0' : 'Info',
		'1' : 'Warning',
		'2' : 'Error',
		'3' : 'Fatal',
	},
};


var controlPanel = {
	getTextFormat: function() {
		return $("#text-type").val();
	},

	/**
	 * Get presentation from the server
	 */
	getPresentation: function() {
		var text = XML.elem(this.getTextFormat(), $("#input").val());
		cont = function(result) {
			var response = mepq.parseServerResponse(result);
			$("#presenter").html(response['presentation']);
			$("#error-body").html(response['errors']);
		};
-       mepq.exec(text,cont);
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