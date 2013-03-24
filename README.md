#node-yp
node-yp is a wrapper library around the Yellow Pages API for nodejs.

##Usage
Install via npm

```
npm install node-yp
```
Then simply require it and instantiate by passing your API key

```
var YellowPages = require('./lib/yellowpages'),
    yp = new YellowPages(api-key);

```

Check out the Yellow Pages API documentation [here](http://developer.yp.com/api-overview/Listings%2520Endpoints). The wrapper library is completely unopinionated and opperates exactly as the docs describe.

##Methods
Each method takes a callback as the final argument. These callbacks follow node convention by exposing an error object as the first argument. The second argument is the JSON response converted to an object literal.
####search(term, params, callback)
####details(id, callback)
####reviews(id, callback)
####listingmap(id, callback)

##License
`node-yp` is released under the MIT license. Checkout the LICENSE file for details.