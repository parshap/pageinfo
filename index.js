"use strict";

var hyperquest = require("hyperquest"),
	jsdom = require("jsdom"),
	gm = require("gm"),
	es = require("event-stream");

var JSDOM_OPTIONS = {
	features: {
		FetchExternalResources: false,
		ProcessExternalResources: false,
	},
};

module.exports = function(url, callback) {
	jsdom.env(url, JSDOM_OPTIONS, function(err, window) {
		if (err) {
			return callback(err);
		}

		getDocumentImages(window.document, function(err, images) {
			callback(err, {
				title: window.document.title,
				images: images.map(getImageSource),
			});
		});
	});
};

function getDocumentImages(document, callback) {
	createImageStream(document)
		.pipe(createImageFilterStream())
		.pipe(es.writeArray(callback));
}

// Get a readable stream emitting document images
function createImageStream(document) {
	return es.readArray(getDocumentImageElements(document));
}

// Get array of image elements in the document
function getDocumentImageElements(document) {
	return toArray(document.getElementsByTagName("img"));
}

// Convert an "array-like" object to a plain JavaScript array
function toArray(array) {
	return Array.prototype.slice.call(array);
}

// Create a through stream, filtering only images that meet criteria
function createImageFilterStream() {
	return es.map(function(image, callback) {
		isValidImage(image, function(err, isValid) {
			// Ignore errors, we will just drop the image
			if (isValid) {
				return callback(null, image);
			}

			callback();
		});
	});
}

// Determine if a given image meets criteria
function isValidImage(image, callback) {
	var url = getImageSource(image);

	if ( ! url) {
		return callback(null, false);
	}

	getImageSize(url, function(err, size) {
		if (err) {
			return callback(err);
		}

		callback(null, isValidSize(size));
	});
}

// Get the dimensions of the image
function getImageSize(image, callback) {
	gm(hyperquest(getImageSource(image))).size(callback);
}

function getImageSource(image) {
	return image.src;
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
