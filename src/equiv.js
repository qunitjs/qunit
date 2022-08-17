import { objectType, slice } from './core/utilities';
import { StringSet, ArrayFrom } from './globals';

const CONTAINER_TYPES = new StringSet(['object', 'array', 'map', 'set']);

function useStrictEquality (a, b) {
  // This only gets called if a and b are not strict equal, and is used to compare on
  // the primitive values inside object wrappers. For example:
  // `var i = 1;`
  // `var j = new Number(1);`
  // Neither a nor b can be null, as a !== b and they have the same type.
  if (typeof a === 'object') {
    a = a.valueOf();
  }
  if (typeof b === 'object') {
    b = b.valueOf();
  }

  return a === b;
}

function getConstructor (obj) {
  const proto = Object.getPrototypeOf(obj);

  return !proto || proto.constructor === null ? Object : proto.constructor;
}

function compareConstructors (a, b) {
  return getConstructor(a) === getConstructor(b);
}

function getRegExpFlags (regexp) {
  return 'flags' in regexp ? regexp.flags : regexp.toString().match(/[gimuy]*$/)[0];
}

function breadthFirstCompareChild (a, b, pairs) {
  // If a is a container not reference-equal to b, postpone the comparison to the
  // end of the pairs queue -- unless (a, b) has been seen before, in which case skip
  // over the pair.
  if (a === b) {
    return true;
  } else if (!CONTAINER_TYPES.has(objectType(a))) {
    return typeEquiv(a, b, pairs);
  } else if (pairs.every((pair) => pair.a !== a || pair.b !== b)) {
    // Not yet started comparing this pair
    pairs.push({ a, b });
  }
  return true;
}

const callbacks = {
  string: useStrictEquality,
  boolean: useStrictEquality,
  number: useStrictEquality,
  null: useStrictEquality,
  undefined: useStrictEquality,
  symbol: useStrictEquality,
  date: useStrictEquality,

  nan () {
    return true;
  },

  regexp (a, b) {
    return a.source === b.source && getRegExpFlags(a) === getRegExpFlags(b);
  },

  // abort (identical references / instance methods were skipped earlier)
  function () {
    return false;
  },

  array (a, b, pairs) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((element, index) => breadthFirstCompareChild(element, b[index], pairs));
  },

  // Define sets a and b to be equivalent if for each element aVal in a, there
  // is some element bVal in b such that aVal and bVal are equivalent. Element
  // repetitions are not counted, so these are equivalent:
  // a = new Set( [ {}, [], [] ] );
  // b = new Set( [ {}, {}, [] ] );
  set (a, b) {
    if (a.size !== b.size) {
      return false;
    }

    const B_ARRAY = ArrayFrom(b);

    return ArrayFrom(a).every((aVal) => B_ARRAY.some((bVal) => innerEquiv(bVal, aVal)));
  },

  // Define maps a and b to be equivalent if for each key-value pair (aKey, aVal)
  // in a, there is some key-value pair (bKey, bVal) in b such that
  // [ aKey, aVal ] and [ bKey, bVal ] are equivalent. Key repetitions are not
  // counted, so these are equivalent:
  // a = new Map( [ [ {}, 1 ], [ {}, 1 ], [ [], 1 ] ] );
  // b = new Map( [ [ {}, 1 ], [ [], 1 ], [ [], 1 ] ] );
  map (a, b) {
    if (a.size !== b.size) {
      return false;
    }

    const B_ARRAY = ArrayFrom(b);

    return ArrayFrom(a)
      .every(([aKey, aVal]) => B_ARRAY.some(([bKey, bVal]) => innerEquiv([bKey, bVal], [aKey, aVal])));
  },

  object (a, b, pairs) {
    if (compareConstructors(a, b) === false) {
      return false;
    }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    for (const key in a) {
      if (
        a.constructor !== Object &&
        typeof a.constructor !== 'undefined' &&
        typeof a[key] === 'function' &&
        typeof b[key] === 'function' &&
        a[key].toString() === b[key].toString()
      ) {
        continue;
      } else if (!(key in b)) {
        return false;
      }

      if (!breadthFirstCompareChild(a[key], b[key], pairs)) {
        return false;
      }
    }

    return true;
  }
};

function typeEquiv (a, b, pairs) {
  const type = objectType(a);

  // Callbacks for containers will append to the pairs queue to achieve breadth-first
  // search order. The pairs queue is also used to avoid reprocessing any pair of
  // containers that are reference-equal to a previously visited pair (a special case
  // this being recursion detection).
  //
  // Because of this approach, once typeEquiv returns a false value, it should not be
  // called again without clearing the pair queue else it may wrongly report a visited
  // pair as being equivalent.
  return objectType(b) === type && callbacks[type](a, b, pairs);
}

function innerEquiv (a, b) {
  if (arguments.length < 2) {
    return true;
  }

  // Value pairs queued for comparison. Used for breadth-first processing order, recursion
  // detection and avoiding repeated comparison.
  let pairs = [{ a, b }];
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];

    // Perform type-specific comparison on any pairs that are not strictly
    // equal. For container types, that comparison will postpone comparison
    // of any sub-container pair to the end of the pair queue. This gives
    // breadth-first search order. It also avoids the reprocessing of
    // reference-equal siblings, cousins etc, which can have a significant speed
    // impact when comparing a container of small objects each of which has a
    // reference to the same (singleton) large object.
    if (pair.a !== pair.b && !typeEquiv(pair.a, pair.b, pairs)) {
      return false;
    }
  }

  // ...across all consecutive argument pairs
  return arguments.length === 2 || innerEquiv.apply(this, slice.call(arguments, 1));
}

export default function equiv (...args) {
  return innerEquiv(...args);
}
