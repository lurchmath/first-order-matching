
# API Reference

## Getting started

### In the browser

Import the minified JavaScript, which you can [download from our repository
directly](https://raw.githubusercontent.com/lurchmath/openmath-js/master/openmath.js)
or import from a CDN with the following one-liner.

```html
<script src='https://cdn.jsdelivr.net/npm/first-order-matching@1.0.5/first-order-matching.js'></script>
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

## Using OpenMath

In order to do work with mathematical expressions, there needs to be some
data structure for storing and some algorithms for manipulating those
expressions.  To provide that need, this module depends upon [an OpenMath
JavaScript implementation](http://www.npmjs.org/package/openmath-js).

If you're using this from the command line, and installing it via `npm`,
then `openmath-js` will automatically be installed as a dependency of this
one.  If you're using this in the browser, be sure to import the OpenMath
JavaScript code into your page before importing this one.  You can access
it from the same CDN that you can access this module, as documented on its
homepage.  (Follow the link above for the exact URL.)

The remainder of this documentation will assume that you know how to create
and use OpenMath objects to represent mathematical expressions.  See the
documentation linked to above if needed.

## Metavariables

Matching compares two expressions, one containing metavariables, and
attempts to create a substitution (a mapping from metavariables to
expressions) that, when applied to the expression containing metavariables,
makes the two expressions equal.

Thus it is necessary to be able to flag certain variables in our expressions
as metavariables, and to detect which variables are metavariables.  The
following functions are provided in this package for doing so.

 * `setMetavariable(x)` - takes an OpenMath variable as input and adds to it
   an attribute that marks it as a metavariable
 * `clearMetavariable(x)` - removes the attribute added by the previous
   function
 * `isMetavariable(x)` - true if and only if x is an OpenMath variable with
   the flag added by `setMetavariable()`

Examples:

<div class="runnable-example">
x = OM.var( 'x' );
matching.setMetavariable( x );
x
</div>

<div class="runnable-example">
y = OM.var( 'y' );
matching.isMetavariable( y );
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
        preamble: 'matching = require( "first-order-matching" );\nOM = require( "openmath-js" ).OM;'
    } );
}
</script>
