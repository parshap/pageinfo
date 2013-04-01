"use strict";

var test = require("tape"),
	pageinfo = require("./");

var URL = "http://en.wikipedia.org/wiki/Fish";

test(function(t) {
	pageinfo(URL, function(err, info) {
		t.error(err);
		t.ok(info);
		t.ok(info.images);
		t.end();
	});
});
