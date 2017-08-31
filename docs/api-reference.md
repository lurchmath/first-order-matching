
# API Reference

## Getting started

### In the browser

Import the minified JavaScript, which you can [download from our repository
directly](https://raw.githubusercontent.com/lurchmath/openmath-js/master/openmath.js)
or import from a CDN with the following one-liner.

```html
<script src='https://cdn.jsdelivr.net/npm/first-order-matching@1.0.2/first-order-matching.js'></script>
```

### From the command line

Or install this package into your project the usual way:

```bash
npm install first-order-matching
```

Then within any of your modules, import it as follows.

```js
matching = require( "first-order-matching" );
```

After that, any of the example code snippets in this documentation should
function as-is.

Example:

<div class="runnable-example">
matching.isMetavariable
</div>

## This documentation is incomplete!  More coming soon...

<script src="https://embed.runkit.com"></script>
<script>
var elements = document.getElementsByClassName( 'runnable-example' );
for ( var i = 0 ; i < elements.length ; i++ ) {
    var source = elements[i].textContent;
    elements[i].textContent = '';
    var notebook = RunKit.createNotebook( {
        element: elements[i],
        source: source,
        preamble: 'matching = require( "first-order-matching" );'
    } );
}
</script>
