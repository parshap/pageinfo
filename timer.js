"use strict";

module.exports = function Timer() {
	this.start = this.time();
};

module.exports.prototype = {
	// Return current hrtime in nanoseconds
	time: function() {
		var t = process.hrtime();
		return t[0] * 1e9 + t[1];
	},

	// Returns elapsed time in ns
	elapsed: function() {
		return this.time() - this.start;
	},
};
