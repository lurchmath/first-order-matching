
# API Reference

## Getting started

### In the browser

Import the minified JavaScript, which you can [download from our repository
directly](https://raw.githubusercontent.com/lurchmath/openmath-js/master/openmath.js)
or import from a CDN with the following one-liner.

```html
<script src='https://cdn.jsdelivr.net/npm/first-order-matching@1/first-order-matching.js'></script>
```

### From the command line

Or install this package into your project the usual way:

```bash
npm install first-order-matching
```

Then within any of your modules, import it as follows.

```js
M = require( "first-order-matching" );
```

After that, any of the example code snippets in this documentation should
function as-is.

### In a [WebWorker](https://www.w3.org/TR/workers/)

To place this script in a WebWorker, you will need to download two source
files and place them in your project's web space.

 * [The minified JavaScript file from this repository](https://raw.githubusercontent.com/lurchmath/first-order-matching/master/first-order-matching.js)
 * [The minified JavaScript file from the OpenMath repository](https://raw.githubusercontent.com/lurchmath/openmath-js/master/openmath.js)

Your script can then create the worker as follows.

```js
W = new Worker( "path/to/first-order-matching.js" );
// it imports openmath.js itself, from the same folder
```

This exposes an asynchronous API documented [below](#webworker-api).  See
the [test-worker.html](../test-worker.html) file for a (very small) example.

## Using OpenMath

In order to do work with mathematical expressions, there needs to be some
data structure for storing and some algorithms for manipulating those
expressions.  To provide that need, this module depends upon [an OpenMath
JavaScript implementation](http://www.npmjs.org/package/openmath-js).

If you're using this from the command line, and installing it via `npm`,
then `openmath-js` will automatically be installed as a dependency of this
one.  Furthermore, it will be accessible through the `first-order-matching`
module, as shown in the examples below.  (If you import this module as `M`,
then the OpenMath constructor is accessible as `M.OM`.)

If you're using this in the browser, be sure to import the OpenMath
JavaScript code into your page before importing this one.  You can access it
from the same CDN that you can access this module, as documented on its
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
x = M.OM.var( 'x' );
M.setMetavariable( x );
M.isMetavariable( x );
</div>

<div class="runnable-example">
y = M.OM.var( 'y' );
M.isMetavariable( y );
</div>

## Expression Functions

This module supports patterns that express the application of a function to
a parameter, where the function maps OpenMath expressions to OpenMath
expressions, as described in the whitepaper accessible from [the main
documentation page](index.md).  We provide the following API for dealing
with such objects.

 * `makeExpressionFunction(x,b)` - makes a new expression function with the
   meaning &lambda;x.b, where x is a variable and b is any OpenMath
   expression.  The x will be bound in the resulting expression.
   An error is thrown if x is not a variable.
 * `isExpressionFunction(e)` - returns true if e is an expression of the
   form created by the previous function, false otherwise.
 * `makeExpressionFunctionApplication(f,a)` - makes an expression whose
   meaning is the application of an expression function f to an argument a.
   Does not verify that f is an expression function; it need not be one, but
   can be a metavariable, for example.
 * `isExpressionFunctionApplication(e)` - returns true if e is an expression
   of the form created by the previous function, false otherwise.
 * `applyExpressionFunction(f,a)` - assumes that f has the form of an
   expression function (i.e., passes `isExpressionFunction`) and applies it
   to the OpenMath expression a.
 * `alphaEquivalent(f,g)` - returns true if and only if both f and g are
   expression functions and they are [alpha
   equivalent](https://en.wikipedia.org/wiki/Lambda_calculus#Alpha_equivalence)

<div class="runnable-example">
ef = M.makeExpressionFunction(
    M.OM.var( 'x' ), M.OM.simple( 'relation1.eq(x,x)' ) );
M.applyExpressionFunction( ef, M.OM.int( 2 ) ).simpleEncode();
</div>

<div class="runnable-example">
M.makeExpressionFunctionApplication(
    M.OM.var( 'P' ), M.OM.var( 'x' ) ).simpleEncode();
</div>

## Constraints

A constraint is a single pattern-expression pair to be solved by the
matching algorithm.  A pattern is an expression containing metavariables,
and a (plain) expression does not contain metavariables.  We provide this
API for dealing with constraints.

 * `new Constraint(p,e)` - creates a new constraint from pattern p and
   expression e
 * `C.pattern`, `C.expression` - access the pattern and expression given at
   construction time
 * `C.copy()` - copies constraint C deeply
 * `C.equals(D)` - returns true if and only if constraints C and D are
   structurally equal as pairs, ignoring any OpenMath attributes

<div class="runnable-example">
C = new M.Constraint( M.OM.simple( 'a(b,c)' ), M.OM.simple( 'f(2,3)' ) );
D = C.copy();
[ C == D, C.equals( D ) ]
</div>

A constraint list is an array of constraints, typically used internally by
the matching algorithm to break single constraints down into smaller parts
to be solved as a set.  Although the matching algorithm can be called on a
set of constraints, it is typically called on a single constraint.  Even so,
this API exists, but is [documented minimally,
below](#minimally-documented-code), because it is of little interest to
clients.

## Matching

The API provides one function for matching, and it is iterative, in the
sense that if finds the first possible match (if any), and can be called
again and again to produce more matches (if there are more).  For this
reason, its return value is a structure with a few elements.

 * `match(constraint)` - yields a pair of values, one of three
   possibilities:
    * `[ null, null ]` - there are no solutions to the match (or no more
      solutions, if this is not the first call)
    * `[ solution, null ]` - there is one solution, given as the first
      element of the pair, and there are no more after it
    * `[ solution, argsArray ]` - there is more than one solution, but the
      first is given as the first element of the pair, and the second
      element of the pair is the array of additional arguments you can pass
      to `match` to get it to find more solutions, as documented below.
 * `match(constraint,x,y)` - if a previous call to `match` gave you an
   `argsArray`, as documented immediately above, it will contain two values
   (let's call them x and y) and if we pass them as extra arguments to
   `match`, it will seek further solutions to the same matching problem,
   returning one of the three possibilities above, as with the first call.

Values returned from `match` are `ConstraintList` instances in which every
member is a pair whose left hand side is a unique metavariable and whose
right hand side is an OpenMath expression, thus embodying the mapping that
the algorithm is designed to produce.  If `R` is such a result, you can get
its list of constraints with `R.contents`.

Examples:

Matching f(x) against f(2) should produce x=2 if x is a metavariable.

<div class="runnable-example">
pattern = M.OM.simple( 'f(x)' );
M.setMetavariable( pattern.children[1] );
expression = M.OM.simple( 'f(2)' );
problem = new M.Constraint( pattern, expression );
pair = M.nextMatch( problem );
solution = pair[0].contents;
for ( var i = 0 ; i < solution.length ; i++ )
    console.log( solution[i].pattern.simpleEncode() + ' --> '
               + solution[i].expression.simpleEncode() );
</div>

Matching f(x) against g(2) should produce f=g and x=2 if both f and x are
metavariables.

<div class="runnable-example">
pattern = M.OM.simple( 'f(x)' );
M.setMetavariable( pattern.children[0] );
M.setMetavariable( pattern.children[1] );
expression = M.OM.simple( 'g(2)' );
problem = new M.Constraint( pattern, expression );
pair = M.nextMatch( problem );
solution = pair[0].contents;
for ( var i = 0 ; i < solution.length ; i++ )
    console.log( solution[i].pattern.simpleEncode() + ' --> '
               + solution[i].expression.simpleEncode() );
</div>

Matching f(x) against f(1,2) should produce no solutions.

<div class="runnable-example">
pattern = M.OM.simple( 'f(x)' );
M.setMetavariable( pattern.children[1] );
expression = M.OM.simple( 'f(1,2)' );
problem = new M.Constraint( pattern, expression );
M.nextMatch( problem );
</div>

Matching f(2) against f(2) should produce an empty solution (i.e., they
match without instantiating any metavariables).

<div class="runnable-example">
pattern = M.OM.simple( 'f(2)' );
expression = M.OM.simple( 'f(2)' );
problem = new M.Constraint( pattern, expression );
pair = M.nextMatch( problem );
pair[0].contents
</div>

These have all been trivial examples.  For more complex examples, see the
[dozens more examples in the unit test suite, here](https://github.com/lurchmath/first-order-matching/blob/master/first-order-matching-spec.litcoffee#should-work-for-atomic-patterns).
Note that they construct expressions with the `quick` function, to make it
easy to create patterns without calling `setMetavariable`.  That function is
defined at the very top of the same file.

## Minimally Documented Code

The following routines are documented only minimally here, because they are
almost never of use to the client of this package.  They are, however,
exposed by the package in its `exports` member, so that they can be subject
to [the unit tests in this
repository](https://github.com/lurchmath/first-order-matching/blob/master/first-order-matching-spec.litcoffee).

The terms and concepts mentioned in this terse documentation are defined in
the whitepaper accessible from [the main documentation page](index.md).

 * `consistentPatterns(p1,p2,...)` - returns true if and only if the set of
   patterns p1, p2, etc. is consistent, as defined in [the source code
   documentation here](https://github.com/lurchmath/first-order-matching/blob/master/first-order-matching.litcoffee#consistent-patterns).
 * `findDifferencesBetween(e1,e2)` - an address set expressing the
   differences between the expressions, as defined in the paper cited above.
 * `parentAddresses(addrs)` - set of parent addresses for all addresses in
   a given set, as defined in the same paper.
 * `partitionedAddresses(e)` - all addresses for all subexpressions of e,
   partitioned by equality of the subexpressions at those addresses
 * `expressionDepth(e)`, `sameDepthAncestors(e,addrs)`,
   `differenceIterator(e1,e2)`, `subexpressionIterator(e)`,
   `prefixIterator(e,iterator)`, `suffixIterator(iterator,e)`,
   `composeIterator(iterator,func)`, `filterIterator(iterator,filter)`,
   `concatenateIterators(first,second)` - See the thorough documentation for
   these [in the source code itself](https://github.com/lurchmath/first-order-matching/blob/master/first-order-matching.litcoffee#iterators).
 * `multiReplace(e,addrs,other)`, `bindingConstraints1(pattern)`,
   `satisfiesBindingConstraints1(solution,constraints)`,
   `bindingConstraints2(pattern)`,
   `satisfiesBindingConstraints2(solution,constraints)` - See the thorough documentation for
   these [in the source code itself](https://github.com/lurchmath/first-order-matching/blob/master/first-order-matching.litcoffee#matching).

Constraint list API:

 * `new ConstraintList(c1,c2,...)` - creates a constraint list given a list
   of constraints
 * `CL.contents` - the array used for internal storage, and which is
   publicly accessible, to be looped over/read/etc.
 * `CL.length()` - number of constraints in the constraint list CL
 * `CL.copy()` - a deep copy with the same order
 * `CL.equals(other)` - equality comparison that ignores order, and uses the
   `equals` member of the `Constraint` class
 * `CL.plus(c1,c2,...)` - a new constraint list created by adding the given
   constraints to the list CL (deep copy, not in-place modification)
 * `CL.minus(c1,c2,...)` - a new constraint list created by removing the
   given constraints from the list CL (if they were there, doing nothing if
   they were not -- deep copy, not in-place modification)
 * `CL.indexAtWhich(P)` - first index at which the predicate P holds of the
   constraint at that index in the list, or -1 if there is no such index
 * `CL.firstSatisfying(P)` - constraint at `CL.indexAtWhich(P)`, or null
 * `CL.firstPairSatisfying(P)` - assuming P is a binary predicate accepting
   two constraints, yields the first pair of indices on whose constraints P
   returns true, by dictionary ordering the pair of the indices
 * `CL.nextNewVariable()` - generate a new variable that does not appear in
   any of the constraints in the list CL; this is an iterator that creates
   an infinite stream of results, different at each call
 * `CL.isFunction()` - whether CL is a function, when viewed as a mapping
   from the space of metavariables to the space of expressions.  To be so,
   the constraint list must contain only constraints whose left hand sides
   are metavariables, and none msut appear in more than one constraint.
 * `CL.lookup(x)` - if `CL.isFunction()` then you can look up variables and
   get back expressions.  Pass a variable as x and this routine does so,
   returning null if it finds no result.
 * `CL.apply(e)` - if `CL.isFunction()`, then you can apply the constraint
   list CL to the expression e and all metavariables x appearing in e will
   be replaced simultaneously with the respective result of `CL.lookup(x)`

## WebWorker API

This section assumes that you have read and understood the API for the
non-WebWorker use of the module, as given in the previous sections.  It also
assumes that you've read the [getting started section](#getting-started) so
that you know how to import this module into a WebWorker.

See the [test-worker.html](../test-worker.html) file for a (very small)
example.

Assuming you've created a worker `W` as in that section, you can then
interact with it through four types of messages.

### Create a new problem

```js
W.postMessage( [ "newProblem", name, LHS, RHS ] );
```

This creates a new matching problem with the given `name` (which will be
treated as a text string) and the given left and right hand sides, `LHS` and
`RHS`.  Each should be the JSON-serialized version of an `OMNode` instance,
created by a call to `N.encode()`, for an `OMNode` instance `N`.

The `LHS` may contain metavariables and expression functions, but the `RHS`
may not. To construct such objects, it may be useful to import the
first-order matching package into the main thread as well, so that you have
access to the functions documented earlier in this page, such as
`setMetavariable()`.

It does not attempt to solve the problem; it only sets it up for later
solution. No return message is posted back to the main thread.

*Example:*

```js
LHS = OM.int( 5 );
RHS = OM.str( "Hello" );
W.postMessage( [ "newProblem", "#1", LHS.encode(), RHS.encode() ] );
// A problem with no solutions has been posed.
```

### Fetch the next solution for an existing problem

```js
W.onmessage = function ( event ) {
    console.log( "Heard back from the worker with this:", event.data );
}
W.postMessage( [ "getSolution", name ] );
```

This instructs the worker to compute a solution to the matching problem with
the given `name`, which must have been set up earlier by a message of the
"newProblem" type.  Because matching problems may have zero, one, or more
solutions, this message may be passed repeatedly to generate as many
solutions as the given problem has.  Each sending of the message requests
that only one solution be computed, and thus the message may need to be sent
multiple times in succession if a problem has more than one solution, and
the client wishes to see more than one.

The results are posted back to the main thread using `postMessage()` from
within the worker thread, and thus the `onmessage` handler must be
implemented, as shown in the example code above.  The data in the `event`
will be an object with these attributes:

 * `name` - the name of the problem, as passed to the message
 * `success` - true if a solution was computed, false if there are no more
   solutions to this problem (besides any yielded earlier)
 * `count` - the total number of solutions computed so far, a running total
 * `solution` - if `success` is true, then this contains the most recently
   generated solution, as an object mapping metavariable names to the JSON
   string representations of `OMNode` instances, which can be decoded into
   actual `OMNode` instances with `OM.decode()`; if `success` is false,
   then this field is undefined

Messages of the "getSolution" type can be passed over and over to generate
new solutions until the result yields a false value for `success`.

*Example:*

```js
function getAllSolutions ( name, LHS, RHS, callback ) {
    var results = [ ];
    W.postMessage( [ "newProblem", name, LHS.encode(), RHS.encode() ] );
    W.onmessage = function ( event ) {
        if ( event.data.success ) {
            results.push( event.data.solution );
            W.postMessage( [ "getSolution", name ] );
        } else {
            callback( results );
        }
    }
    W.postMessage( [ "getSolution", name ] );
}
```

### Delete an old problem

```js
W.postMessage( [ "deleteProblem", name ] );
```

Lets the worker reclaim memory by discarding problems about which no further
messages will be passed.

*Example:*

```js
W.postMessage( [ "deleteProblem", "#1" ] );
```

<script src="https://embed.runkit.com"></script>
<script>
var elements = document.getElementsByClassName( 'runnable-example' );
for ( var i = 0 ; i < elements.length ; i++ ) {
    var source = elements[i].textContent;
    elements[i].textContent = '';
    var notebook = RunKit.createNotebook( {
        element: elements[i],
        source: source,
        preamble: 'M = require( "first-order-matching" );'
    } );
}
</script>
