This module returns information about an HTML document located at the
given URI. Currently the following information is available:

 * Title
 * Images (that meet size criteria)

# Usage

```js
	var pageinfo = require("pageinfo"),

	pageinfo("http://en.wikipedia.org/wiki/Fish", function(err, info) {
		if (err) throw err;
		console.log(title)
		console.log(images.length, "images found");
	});
```

# Authors

 * [Parsha Pourkhomami](https://github.com/parshap)
 * [Preston Lewis](https://github.com/hosemagi)
