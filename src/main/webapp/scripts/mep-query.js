var XML = {
    /** 
     * helper function to produce xml attributes: key="value"
     * @param key string Key
     * @param value string Value
     * @return string key="value"
     */
	attr : function (key, value) {return ' ' + key + '="' + value + '"';},
	
	/** 
	 * helper function to produce xml elements with 0-2 attributes
	 * @param tag string Tag name
	 * @param content string Body of xml element (optional)
	 * @param key1 string First attribute name (optional)
	 * @param value1 string First attribute value (optional)
	 * @param key2 string Second attribute name (optional)
	 * @param value2 string Second attribute value (optional)
	 * @return string <tag key1="value1" key2="value2">content</tag>
	 */
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
	 * @param to string API path
	 * @param cont fuction Function to process server response
	 */ 
	exec: function(q, to, cont) {
		var qURL = this.queryURL('/api/' + to);
		$.ajax({
			url: qURL,
			type:'POST',
			data: q,
			contentType: false,
		}).done(cont);
	},

	/**
	 * @param response string Errors, OMDoc and presentation as XML
	 * @return object Object with presentation and errors {presentation:presentation, errors: errors, omdoc:OMDoc}
	 */
	parseServerResponse : function(response) {
		var pres = $(response).find("presentation").first().html();
		var errors = $(response).find("error");
		var out = {};
		out['presentation'] = pres;
		out['errors'] = '<ul>';
		$.each(errors, function(key, error) {
			out['errors'] += '<li>';
			var level = $(error).attr('level');
			var srcref = $(error).attr('srcref') ? "  at " + $(error).attr('srcref') : "";
			var shortmsg = $(error).find('shortmsg').html();
			out['errors'] += '<p>';
			out['errors'] += XML.elem('u', 
				mepq.error_map[level] + srcref, 
				'style', 
				'color:' + mepq.color_map[level]
			);
			out['errors'] += " " + shortmsg;
			out['errors'] += '</p>';
			out['errors'] += '</li>';
		});	
		out['errors'] += '</ul>';
		out['omdoc'] = $(response).find("omdoc").first().html();
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
		var text = $("#input").val();
		var textFormat = this.getTextFormat();
		cont = function(result) {
			var response = mepq.parseServerResponse(result);
			$("#presenter").html(response['presentation']);
			$("#error-body").html(response['errors']);
			$("#omdoc-body").html('<pre>' + unescape(response['omdoc']) + '</pre>');
			// in case Chrome and MathJax defined regenerate MathML
			if (typeof MathJax != 'undefined') {
				setTimeout(function() {MathJax.Hub.Queue(["Typeset",MathJax.Hub, "presenter"]);}, 500);
			}
		};
        mepq.exec(text, textFormat, cont);
	},

	/**
	 * Get raw source in OEIS text format by article ID
	 */
	loadArticle: function() {
		var artID =  $("#artid").val();
		var reg = new RegExp("^(A[0-9]+)$");
		// check for validity of ID
		if (reg.test(artID)) {
			$("#in-artid").removeClass("has-error");
			cont = function(result) {
				$("#input").val(result);
				controlPanel.getPresentation();
			};
			// query for source
			mepq.exec(artID, "oeis/article", cont);
		} else {
			$("#in-artid").addClass("has-error");
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

/**
 * Funtionality of hide buttons
 */
function hidePanel(panel_body, me) {
	$(panel_body).collapse('toggle');
	me.children('.glyphicon').toggleClasses("glyphicon-chevron-up", "glyphicon-chevron-down");
}

//################# EXAMPLES ###################\
examples = {
	"0" : "",
	"1" : "%F A000045 F(n) = ((1+sqrt(5))^n-(1-sqrt(5))^n)/(2^n*sqrt(5)).",
	"2" : "%F A001147 a(n) = a(n-1)*(2*n-1) = (2*n)!/(n!*2^n) = A010050(n)/A000165(n).",
	"3" : "%F A000055 G.f.: A(x) = 1 + T(x) - T^2(x)/2 + T(x^2)/2, where T(x) = x + x^2 + 2*x^3 + ... is the g.f. for A000081.",
};

$(function() {
  $('#example').change(function() {
     $('#input').val(examples[$('#example').val()]);
     controlPanel.getPresentation();	
  });
 });

function example(id) {
	$('#artid').val(id);
    controlPanel.loadArticle();
}