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
				title: getDocumentTitle(window.document),
				images: images,
			});
		});
	});
};

function getDocumentTitle(document) {
	return document.querySelector("title").text;
}

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

// Convert a DOM NodeList object to a plain JavaScript array
function toArray(nodeList) {
	return Array.prototype.slice.call(nodeList);
}

// Create a through stream, filtering only images that meet criteria
function createImageFilterStream(options) {
	return es.map(function(image, callback) {
		isValidImage(image, function(err, isValid) {
			if (err) {
				return callback(err);
			}

			if (isValid) {
				return callback(null, image);
			}

			callback();
		});
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
function getImageSize(image, callback) {
	gm(hyperquest(image.src)).size(callback);
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
