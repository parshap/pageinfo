"use strict";

var LIMIT = 10;

var async = require("async"),
	es = require("event-stream"),
	stats = require("measured").createCollection(),
	Timer = require("./timer"),
	pageinfo = require("./");

var urls = require("./bench_urls.json").slice(0, 100);

var count = 0,
	timeSum = 0,
	imageSum = 0;

async.forEachLimit(urls, LIMIT, getInfo, function(err) {
	if (err) throw err;
	console.log(stats.toJSON());
});

function getInfo(url, callback) {
	// var t = new Timer();
	var t = stats.timer("time").start();
	pageinfo(url, function(err, info) {
		if (err) {
			console.log("Error", err);
			return callback();
		}

		stats.histogram("images").update(info.images.length);
		t.end();

		callback();
	});
}
