function createSet (values) {
  const x = new Set();
  for (const value of values) {
    x.add(value);
  }
  return x;
}

function createEntries (list) {
  const entries = [];
  let i = 0;
  while (i + 1 < list.length) {
    entries.push([
      list[i],
      list[i + 1]
    ]);
    i += 2;
  }
  return entries;
}

function createObject (list) {
  return Object.fromEntries(createEntries(list));
}

function createObjectWithValue (list, value) {
  const x = {};
  for (const key of list) {
    x[key] = value;
  }
  return x;
}

function createMap (list) {
  return new Map(createEntries(list));
}

function createArrayDeep (list) {
  const top = [];
  let current = top;
  let i = 0;
  while (i < list.length) {
    current.push(list[i]);
    const next = [];
    current.push(next);
    current = next;
    i++;
  }

  return top;
}

function createObjectDeep (list) {
  const top = {};
  let current = top;
  let keys = list.slice();
  while (keys.length >= 3) {
    current[keys.pop()] = 1;
    current[keys.pop()] = true;
    const next = {};
    current[keys.pop()] = next;
    current = next;
  }

  return top;
}

function X (val) {
  this.val = val;
}
X.prototype.getVal = function () {
  return this.val;
};
function Y (val) {
  this.val = val;
}
Y.prototype.getVal = function () {
  return this.val;
};
function Point (x, y) {
  this.x = x;
  this.y = y;
}
function Line (points) {
  this.setPoints(points);
}
Line.prototype.setPoints = function (points) {
  this.head = points[0];
  this.points = points;
};
function NamedLine (title, points) {
  Line.call(this, points);
  this.setTitle(title);
}
NamedLine.prototype = Object.create(Line.prototype);
NamedLine.prototype.constructor = NamedLine;
NamedLine.prototype.setTitle = function (title) {
  this.title = title;
};

function createClassTree (list) {
  const points = [];
  let i = 0;
  while (i + 1 < list.length) {
    points.push(new Point(
      new X(list[i].length),
      new Y(list[i + 1].length)
    ));
    i += 2;
  }

  return new NamedLine(list[0], points);
}

const listEdible = [
  'Allahabadi Surkha',
  'Annona longiflora',
  'Annona nutans',
  'Annona paludosa',
  'Annonaceae',
  'Apricot',
  'Arbutus unedo',
  'Aristotelia serrata',
  'Asimina parviflora',
  'Asimina triloba',
  'Atriplex semibaccata',
  'Averrhoa bilimbi',
  'Banana',
  'Banana melon',
  'Banana passionfruit',
  'Breadfruit',
  'Burchellia',
  'Bush tomato',
  'Cherimoya',
  'Chrysophyllum cainito',
  'Citrus australasica',
  'Citrus australis',
  'Clausena lansium',
  'Clymenia (plant)',
  'Cornus canadensis',
  'Cornus mas',
  'Couepia polyandra',
  'Crataegus crus-galli',
  'Crataegus phaenopyrum',
  'Crataegus succulenta',
  'Crataegus tanacetifolia',
  'Cucumis prophetarum',
  'Date-plum',
  'Diospyros blancoi',
  'Eugenia calycina',
  'Eugenia pyriformis',
  'Eugenia reinwardtiana',
  'Ficus carica',
  'Ficus pumila',
  'Fig',
  'Fruit hat',
  'Gac',
  'Garcinia assamica',
  'Garcinia cowa',
  'Garcinia forbesii',
  'Garcinia humilis',
  'Garcinia lanceifolia',
  'Garcinia magnifolia',
  'Garcinia pseudoguttifera',
  'Gaya melon',
  'Glycosmis parviflora',
  'Glycosmis pentaphylla',
  'Grape',
  'Guava',
  'Haruka (citrus)',
  'Honeydew (melon)',
  'Irvingia',
  'Kajari melon',
  'Kanpei',
  'Kawachi Bankan',
  'Kinkoji unshiu',
  'Kiwifruit',
  'Kobayashi mikan',
  'Koji orange',
  'Kolkhoznitsa melon',
  'Kuchinotsu No. 37',
  'Leycesteria formosa',
  'Licania platypus',
  'Litsea garciae',
  'Longan',
  'Lonicera caerulea',
  'Lucuma',
  'Lychee',
  'Mahonia fremontii',
  'Mango',
  'Mangosteen',
  'Mayhaw',
  'Mespilus germanica',
  'Mirza melon',
  'Morinda citrifolia',
  'Morus nigra',
  'Nectaplum',
  'Nephelium chryseum',
  'Nephelium xerospermoides',
  'Pandanus tectorius',
  'Passiflora',
  'Passiflora ligularis',
  'Passiflora tarminiana',
  'Persimmon',
  'Physalis pubescens',
  'Pineapple',
  'Pitaya',
  'Pomegranate',
  'Pompia',
  'Produce',
  'Prunus americana',
  'Psidium cattleyanum',
  'Pulasan',
  'Quince',
  'Rambutan',
  'Rhus typhina',
  'Ribes americanum',
  'Ribes montigenum',
  'Rubus spectabilis',
  'Rubus tricolor',
  'Rubus ulmifolius',
  'Sambucus nigra',
  'Sandoricum koetjape',
  'Seedless fruit',
  'Sonneratia caseolaris',
  'Sorbus americana',
  'Stone fruits',
  'Sugar-apple',
  'Sunflower seed',
  'Sycamine',
  'Tamarillo',
  'Viburnum edule',
  'Volkamer lemon',
  'Watermelon',
  'White sapote',
  'Xocotl'
];

const listDishes = [
  'Açaí na tigela',
  'Ashure',
  'Asinan',
  'Avakaya',
  'Banbury cake',
  'Black bun',
  'Boerenjongens',
  'Bombe glacée',
  'Candle salad',
  'Chakka prathaman',
  'Chakkavaratti',
  'Charlotte (cake)',
  'Chorley cake',
  'Clafoutis',
  'Cobbler (food)',
  'Compote',
  'Cranachan',
  'Crema de fruta',
  'Crisp (dessert)',
  'Crumble',
  'Cumberland rum nicky',
  'Daechu-gom',
  'Dolma',
  'Donauwelle',
  'Duff (dessert)',
  'Eccles cake',
  'Es buah',
  'Es campur',
  'Es teler',
  'Eton mess',
  'Flaugnarde',
  'Flies graveyard',
  'Frogeye salad',
  'Fruit butter',
  'Fruit curd',
  'Fruit fool',
  'Fruit hat (pudding)',
  'Fruit ketchup',
  'Fruit salad',
  'Fruit whip',
  'Fruitcake',
  'Grape syrup',
  'Güllaç',
  'Gwapyeon',
  'Hagebuttenmark',
  'Hakuto jelly',
  'Hwachae',
  'Kirschenmichel',
  'Kompot',
  'Krentjebrij',
  'Lörtsy',
  'Malvern pudding',
  'Manchester tart',
  'Mango cake',
  'Mango float',
  'Mango pudding',
  'Marillenknödel',
  'Mincemeat',
  'Multekrem',
  'Murabba',
  'Peach Melba',
  'Peaches and cream',
  'Persimmon pudding',
  'Pestil',
  'Poi',
  'Pork chops and applesauce',
  'Qubani-ka-Meetha',
  'Relish',
  'Rødgrød',
  'Rojak',
  'Rose hip soup',
  'Rumtopf',
  'Seafoam salad',
  'Spotted dick',
  'Summer pudding',
  'Takihi',
  'Tanghulu',
  'Tarte des Alpes',
  'Tilslørte bondepiker',
  'Tomato jam',
  'Tutti frutti',
  'Vispipuuro',
  'Xi gua lao'
];

// eslint-disable-next-line no-undef
globalThis.QUnitFixtureEquiv = [
  {
    name: 'primitives',
    pairs: listEdible.concat(listDishes).map(value => {
      return {
        a: value,
        b: value,
        equal: true
      };
    })
  },
  {
    name: 'small arrays',
    pairs: [
      ...listEdible.slice(0, 5).map(value => {
        return {
          a: [value],
          b: [value],
          equal: true
        };
      }),
      {
        a: listEdible.slice(0, 10),
        b: listEdible.slice(0, 10),
        equal: true
      },
      {
        a: listDishes.slice(0, 10),
        b: listDishes.slice(0, 10),
        equal: true
      }
    ]
  },
  {
    name: 'deep arrays',
    pairs: [
      {
        a: createArrayDeep(listEdible),
        b: createArrayDeep(listEdible),
        equal: true
      }
    ]
  },
  {
    name: 'arrays',
    pairs: [
      {
        a: listEdible,
        b: listEdible.slice(),
        equal: true
      },
      {
        a: listEdible.concat(listDishes),
        b: listEdible.concat(listDishes),
        equal: true
      },
      {
        a: listEdible.concat(listDishes).concat(['foo']),
        b: listEdible.concat(listDishes).concat(['bar']),
        equal: false
      }
    ]
  },
  {
    name: 'small objects',
    pairs: [
      ...listEdible.slice(0, 5).map(value => {
        const a = {};
        const b = {};
        a[value] = 1;
        b[value] = 1;
        return {
          a,
          b,
          equal: true
        };
      })
    ]
  },
  {
    name: 'deep objects',
    pairs: [
      {
        a: createObjectDeep(listEdible),
        b: createObjectDeep(listEdible),
        equal: true
      }
    ]
  },
  {
    name: 'objects',
    pairs: [
      {
        a: createObjectWithValue(listEdible, true),
        b: createObjectWithValue(listEdible, true),
        equal: true
      },
      {
        a: createObjectWithValue(listDishes, 1),
        b: createObjectWithValue(listDishes, 1),
        equal: true
      },
      {
        a: createObject(listDishes),
        b: createObject(listDishes.slice()),
        equal: true
      },
      {
        a: createObject(listEdible),
        b: createObject(listEdible.slice(0, -5)),
        equal: false
      }
    ]
  },
  {
    name: 'small sets',
    pairs: [
      ...listEdible.slice(0, 5).map(value => {
        return {
          a: createSet([value]),
          b: createSet([value]),
          equal: true
        };
      }),
      {
        a: createSet(listEdible.slice(0, 10)),
        b: createSet(listEdible.slice(0, 10).reverse()),
        equal: true
      },
      {
        a: createSet(listDishes.slice(0, 10)),
        b: createSet(listDishes.slice(0, 10).reverse()),
        equal: true
      }
    ]
  },
  {
    name: 'sets',
    pairs: [
      {
        a: createSet(listEdible),
        b: createSet(listEdible.slice().reverse()),
        equal: true
      },
      {
        a: createSet(listEdible),
        b: createSet(listEdible.slice(0, -1)),
        equal: false
      },
      {
        a: createSet(listEdible.concat(listDishes).sort()),
        b: createSet(listEdible.concat(listDishes).sort().reverse()),
        equal: true
      },
      {
        a: createSet(listEdible.concat(listDishes).sort()),
        b: createSet(listDishes.slice(0, -1).concat(listEdible.slice(0, -1)).sort()),
        equal: false
      },
      {
        a: listEdible.concat(listDishes).concat(['foo']),
        b: listDishes.concat(listEdible).concat(['bar']),
        equal: false
      }
    ]
  },
  {
    name: 'maps',
    pairs: [
      {
        a: createMap(listEdible),
        b: createMap(listEdible.slice()),
        equal: true
      },
      {
        a: createMap(listDishes),
        b: createMap(listDishes.slice(0, -5)),
        equal: false
      }
    ]
  },
  {
    name: 'class trees',
    pairs: [
      {
        a: createClassTree(listEdible),
        b: createClassTree(listEdible.slice()),
        equal: true
      },
      {
        a: createClassTree(listEdible),
        b: createClassTree(listEdible.slice(0, -5)),
        equal: false
      }
    ]
  }
];
