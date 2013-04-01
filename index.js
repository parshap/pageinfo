"use strict";

var URL = "http://en.wikipedia.org/wiki/Fish";

var url = require("url"),
	request = require("request"),
	jsdom = require("jsdom"),
	gm = require("gm"),
	async = require("async");

function getImgSrc(imageNode) {
	return imageNode.attributes.src.value;
}

// Get content of URL
function getImageURLs(docURL, callback) {
	function getAbsURL(imgURL) {
		return url.resolve(docURL, imgURL);
	}

	request(docURL, function(err, response, result) {
		jsdom.env(result, function(err, window) {
			if (err) {
				return callback(err);
			}

			var imgNodeList = window.document.getElementsByTagName("img"),
				imgArray = Array.prototype.slice.call(imgNodeList),
				srcArray = imgArray.map(getImgSrc),
				imgURLs = srcArray.map(getAbsURL);

			callback(null, imgURLs);
		});
	});
}

function getImageSize(source, callback) {
	var readStream = request(source),
		gmImg = gm(readStream);

	gmImg.size(callback);
}


var MIN_ASPECT = 1 / 3,
	MAX_ASPECT = 10,
	MIN_AREA = 100 * 100;

function isSizeValid(size) {
	var aspect = size.height / size.width,
		area = size.width * size.height;

	return aspect > MIN_ASPECT &&
		aspect < MAX_ASPECT &&
		area > MIN_AREA;
}

function getViableImages(docURL, callback) {
	getImageURLs(docURL, function(err, imgURLs) {
		async.filter(imgURLs, function(imgURL, callback) {
			getImageSize(imgURL, function(err, size) {
				if (err) {
					return callback(err);
				}

				callback(isSizeValid(size));
			});
		}, callback);
	});
}

getViableImages(URL, function(err, images) {
	console.log(err, images);
});
