"use strict";

var test = require("tape"),
	pageinfo = require("./");

var URL = "http://en.wikipedia.org/wiki/Fish",
	TITLE = "Fish - Wikipedia, the free encyclopedia";

test(function(t) {
	pageinfo(URL, function(err, info) {
		t.error(err);
		t.ok(info);
		t.ok(info.images);
		t.equal(info.title, TITLE);
		t.end();
	});
});
