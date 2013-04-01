"use strict";

var request = require("request"),
	jsdom = require("jsdom"),
	gm = require("gm"),
	async = require("async");

// Return images
module.exports = function(docURL, callback) {
	getImageURLs(docURL, function(err, imgURLs) {
		if (err) {
			return callback(err);
		}

		filterImages(imgURLs, function(err, images) {
			callback(err, {
				images: images
			});
		});
	});
};

// Get content of URL
function getImageURLs(docURL, callback) {
	var opts = {
		html: docURL,
		features: {
			FetchExternalResources: false,
			ProcessExternalResources: false,
		}
	};

	jsdom.env(opts, function(err, window) {
		if (err) {
			return callback(err);
		}

		var images = getDocumentImages(window.document)
			.map(function(imageEl) {
				return imageEl.src;
			});

		callback(null, images);
	});
}

// Get array of image elements in the document
function getDocumentImages(document) {
	return toArray(document.getElementsByTagName("img"));
}

// Convert a DOM NodeList object to a plain JavaScript array
function toArray(nodeList) {
	return Array.prototype.slice.call(nodeList);
}

// Filter array of images to only include valid ones
function filterImages(images, callback) {
	var results = [];

	function checkImage(image, callback) {
		isValidImage(image, function(err, isValid) {
			if (isValid) {
				results.push(image);
			}

			callback(err);
		});
	}

	async.forEach(images, checkImage, function(err) {
		callback(err, results);
	});
}

// Determine if a given image meets criteria
function isValidImage(image, callback) {
	getImageSize(image, function(err, size) {
		if (err) {
			return callback(err);
		}

		callback(null, isValidSize(size));
	});
}

// Get the dimensions of the image
function getImageSize(url, callback) {
	gm(request(url)).size(callback);
}

// Determine if the give image size meets criteria
function isValidSize(size) {
	var MIN_ASPECT = 1 / 3,
		MAX_ASPECT = 10,
		MIN_AREA = 100 * 100;

	var aspect = size.height / size.width,
		area = size.width * size.height;

	return aspect > MIN_ASPECT &&
		aspect < MAX_ASPECT &&
		area > MIN_AREA;
}
