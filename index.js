
// This file is only for when this package is installed via npm.
// It is what will be imported when users require this package.
// It imports the utilities from first-order-matching.litcoffee.

path = require( 'path' );
var matching = require( path.resolve( __dirname, 'first-order-matching' ) );
exports.setMetavariable = matching.setMetavariable;
exports.clearMetavariable = matching.clearMetavariable;
exports.isMetavariable = matching.isMetavariable;
exports.makeExpressionFunction = matching.makeExpressionFunction;
exports.isExpressionFunction = matching.isExpressionFunction;
exports.makeExpressionFunctionApplication = matching.makeExpressionFunctionApplication;
exports.isExpressionFunctionApplication = matching.isExpressionFunctionApplication;
exports.applyExpressionFunction = matching.applyExpressionFunction;
exports.alphaEquivalent = matching.alphaEquivalent;
exports.consistentPatterns = matching.consistentPatterns;
exports.Constraint = matching.Constraint;
exports.ConstraintList = matching.ConstraintList;
exports.findDifferencesBetween = matching.findDifferencesBetween;
exports.parentAddresses = matching.parentAddresses;
exports.partitionedAddresses = matching.partitionedAddresses;
exports.expressionDepth = matching.expressionDepth;
exports.sameDepthAncestors = matching.sameDepthAncestors;
exports.differenceIterator = matching.differenceIterator;
exports.subexpressionIterator = matching.subexpressionIterator;
exports.prefixIterator = matching.prefixIterator;
exports.suffixIterator = matching.suffixIterator;
exports.composeIterator = matching.composeIterator;
exports.filterIterator = matching.filterIterator;
exports.concatenateIterators = matching.concatenateIterators;
exports.multiReplace = matching.multiReplace;
exports.bindingConstraints1 = matching.bindingConstraints1;
exports.satisfiesBindingConstraints1 = matching.satisfiesBindingConstraints1;
exports.bindingConstraints2 = matching.bindingConstraints2;
exports.satisfiesBindingConstraints2 = matching.satisfiesBindingConstraints2;
exports.setMatchDebug = matching.setMatchDebug;
exports.nextMatch = matching.nextMatch;
exports.OM = matching.OM
exports.OMNode = matching.OMNode

