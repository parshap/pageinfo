This module returns information about an HTML document located at the
given URI. Currently the following information is available:

 * Title
 * Images (that meet size criteria)

# GraphicsMagick

This module depends on [GraphicsMagick](http://www.graphicsmagick.org/)
being installed on the system. You can find installation instructions
[here](http://www.graphicsmagick.org/README.html) or use your favorite
package manager.

# Usage

```js
	var pageinfo = require("pageinfo");

	pageinfo("http://en.wikipedia.org/wiki/Fish", function(err, info) {
		if (err) throw err;
		console.log(info.title);
		console.log(info.images.length, "images found");
	});
```

# Tests

Run tests with npm:

```js
    npm test
```

# Authors

 * [Parsha Pourkhomami](https://github.com/parshap)
 * [Preston Lewis](https://github.com/hosemagi)
