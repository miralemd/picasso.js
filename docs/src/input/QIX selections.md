# QIX selections helper

The QIX selections helper provides a mapping from brushed data points to suitable QIX selections.

## By dimension value

Brushing dimension values is done by adding the value of `qElemNumber` to the brush, and providing the path to the relevant dimension:

```js
const b = chart.brush('selection');
b.addValue('/qHyperCube/qDimensionInfo/2', 4);
b.addValue('/qHyperCube/qDimensionInfo/2', 7);
```

Calling `q.brush` with the above instance generates relevant QIX methods and parameters to apply the selection:

```js
const selection = picasso.q.brush(b)[0];
// {
//   method: 'selectHyperCubeValues',
//   params: [
//     '/qHyperCubeDef', // path to hypercube to apply selection on
//     2, // dimension column
//     [4, 7], // qElemNumbers
//     false
//   ]
// }
```

The selection can then be applied on a QIX model:

```js
model[selection.method](...selection.params);
```

## By measure range

Brushing measure ranges:

```js
const b = chart.brush('selection');
b.addRange('/qHyperCube/qMeasureInfo/2', { min: 13, max: 35 });

const selection = picasso.q.brush(b)[0];
// {
//   method: 'rangeSelectHyperCubeValues',
//   params: ['/qHyperCubeDef', [
//     {
//       qMeasureIx: 2,
//       qRange: { qMin: 13, qMax: 35, qMinIncEq: true, qMaxInclEq: true }
//     }
//   ]]
// }
```

## By dimension range

Brushing dimension ranges:

```js
const b = chart.brush('selection');
b.addRange('/qHyperCube/qDimensionInfo/1', { min: 13, max: 35 });

const selection = picasso.q.brush(b)[0];
// {
//   method: 'selectHyperCubeContinuousRange',
//   params: ['/qHyperCubeDef', [
//     {
//       qDimIx: 1,
//       qRange: { qMin: 13, qMax: 35, qMinIncEq: true, qMaxInclEq: false }
//     }
//   ]]
// }
```

## By row indices

Brushing by table row index and column:

```js
const b = chart.brush('selection');
b.addValue('/qHyperCube/qDimensionInfo/1', 10);
b.addValue('/qHyperCube/qDimensionInfo/1', 13);
b.addValue('/qHyperCube/qDimensionInfo/0', 11);
b.addValue('/qHyperCube/qDimensionInfo/0', 17);
```

In the above case, rows `10` and `13` have been brushed on dimension `1`, and rows `11` and `17` on dimension `0`.
To extract the relevant information, `byCells` is enabled:

```js
const selection = picasso.q.brush(b, { byCells: true })[0];
// {
//   method: 'selectHyperCubeCells',
//   params: [
//     '/qHyperCubeDef',
//     [10, 13], // row indices in hypercube
//     [1, 0] // column indices in hypercube
//   ]
// }
```

Row indices are used from the first dimension that adds a value to a brush,  `/qDimensionInfo/1` in above case.
To use values from another dimension, `primarySource` should be set:

```js
const selection = picasso.q.brush(b, {
  byCells: true,
  primarySource: '/qHyperCube/qDimensionInfo/0'
})[0];
// {
//   method: 'selectHyperCubeCells',
//   params: [
//     '/qHyperCubeDef',
//     [11, 17], // row indices in hypercube
//     [1, 0] // column indices in hypercube
//   ]
// }
```

## By attribute dimension

Brush on attribute dimension values:

```js
const b = chart.brush('selection');
b.addValue('/qHyperCube/qDimensionInfo/2/qAttrDimInfo/3', 6);
b.addValue('/qHyperCube/qDimensionInfo/2/qAttrDimInfo/3', 9);

const selection = picasso.q.brush(b)[0];
// {
//   method: 'selectHyperCubeValues',
//   params: [
//     '/qHyperCubeDef/qDimensions/2/qAttributeDimensions/3', // path to hypercube to apply selection on
//     0, // dimension column in attribute dimension table
//     [6, 9], // qElemNumbers
//     false
//   ]
// }
```

## By attribute expression range

Brush on attribute expression range:

```js
const b = chart.brush('selection');
b.addRange('/qHyperCube/qMeasureInfo/1/qAttrExprInfo/2', { min: 11, max: 21 });
```

QIX selections on attribute expressions are similar to selections on measure ranges. In this case however, the index of the measure
is derived from the number of measures and attribute expressions that exist in the hypercube. Therefore, to calculate
the index, `layout` containing the hypercube needs to be provided as a parameter:

```js
const selection = picasso.q.brush(b, {}, layout)[0];
// {
//   method: 'rangeSelectHyperCubeValues',
//   params: ['/qHyperCubeDef', [
//     {
//       qMeasureIx: 7,
//       qRange: { qMin: 11, qMax: 21, qMinIncEq: true, qMaxInclEq: true }
//     }
//   ]]
// }
```

Assuming a `layout` of: 
```js
{
  qHyperCube: {
    qDimensionInfo: [
      { qAttrExprInfo: [{}] }
    ],
    qMeasureInfo: [
      { qAttrExprInfo: [{}, {}] },
      { qAttrExprInfo: [{}, {}, {/* this is the one */ }] }
    ]
  }
}
```

then `qMeasureIx` is calculated as follows:

- number of measures: `2`
- total number of attribute expressions in all dimensions: `1`
- total number of attribute expressions in measures preceding the one specified: `2` (from first measure)
- the actual index of the specified attribute expression: `2`

which results in `2 + 1 + 2 + 2 = 7`

## API reference

{{>magic ctx='q.brush.q-brush-js'}}
