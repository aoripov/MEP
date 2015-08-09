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

// functions to build and run MEP queries
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
	},
};