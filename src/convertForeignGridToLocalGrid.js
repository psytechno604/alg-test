
// constants:
const maxAngle = Math.PI / 10;

const maxAngleForDistY = Math.PI / 3.9;

const maxDistanceCoeff = 1.5; // maxDistance = maxDistanceCoeff * maxWidth

const label1 = 1;

// functions:

function distY(a, b) {
  if (a.y == b.y)
    return Number.POSITIVE_INFINITY;
  if (Math.abs(Math.atan((a.x - b.x) / (a.y - b.y))) < maxAngleForDistY) {
    return b.y - a.y;
  }
  return Number.POSITIVE_INFINITY;
}

function distYbetweenSubrows(inp, lbl1, lbl2) {
  let sub1 = inp.filter(e => e.label == lbl1);
  let sub2 = inp.filter(e => e.label == lbl2);
  let minDist = Number.POSITIVE_INFINITY;
  sub1.map(el1 => sub2.map(el2 => {
    let dist = distY(el1, el2);
    if (Math.abs(dist) < Math.abs(minDist))
      minDist = dist;
  }));
  return minDist;
}

function rowCenterY(inp, lbl) {
  let sub = inp.filter(e => e.label == lbl);
  let cx = findCenterX(inp).cX;
  let maxWidth = findMaxWidth(inp);
  let minDx = Number.POSITIVE_INFINITY;
  let cY = Number.NEGATIVE_INFINITY;
  sub.map(el => {
    let dx = Math.abs(el.x - cx);
    if (dx < minDx && dx < maxWidth * 3) {
      cY = el.y;
      minDx = dx;
    }
  });
  return cY;
}

function setIndex(input) {
  let index = 0;
  input.map(el => {
    if (! (el.width>0)) {
      throw 'all seats should have width>0';
    }
    if (! (el.x>=0)) {
      throw 'all seats should have x>=0';
    }
    if (! (el.y>=0)) {
      throw 'all seats should have y>=0';
    }
    el.index = index;
    el.label = undefined;
    index++;
  })
}

function findMaxWidth(input) {
  let maxWidth = 0;
  input.map(el => {
    if (el.width > maxWidth)
      maxWidth = el.width;
  });
  return maxWidth;
}

function findMinWidth(input) {
  let minWidth = Number.POSITIVE_INFINITY;
  input.map(el => {
    if (el.width < minWidth)
      minWidth = el.width;
  });
  return minWidth;
}


function findCenterX(input) {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  input.map(el => {
    if (el.x < minX)
      minX = el.x;
    if (el.x > maxX)
      maxX = el.x;
  });
  return { minX, maxX, cX: (minX + maxX) / 2};
}

function findStartElement(input) {
  minY = Number.MAX_SAFE_INTEGER;
  const subset = input.filter(e => e.label == undefined);
  subset.map(el => {
    if (el.y < minY)
      minY = el.y;
  });
  return subset.find(el => el.y == minY);
}

function testPoint(a, b, maxDistance, label) {
  if (b.label == label)
    return false;
  if ((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) >= maxDistance * maxDistance)
    return false;
  if (a.x == b.x)
    return false;
  if (Math.abs((a.y - b.y) / (a.x - b.x)) > Math.tan(maxAngle))
    return false;
  return true;
}

function findSubRow(input, i, maxDistance, label) {
  input[i].label = label;
  const filtered = input.filter(el => testPoint(input[i], el, maxDistance, label));
  filtered.map(el => {
    el.label = label;
  });

  //step++;

  filtered.map(el => findSubRow(input, el.index, maxDistance, label));
}

function detectSubRows(input) {
  const maxDistance = findMaxWidth(input) * maxDistanceCoeff;
  const labels = [];
  let label = label1;
  while (input.find(el => !el.label)) {
    const startElement = findStartElement(input);
    findSubRow(input, startElement.index, maxDistance, label);
    labels.push(label);
    label++;
  }
  input.sort((e1, e2) => { if (e1.label < e2.label) return -1; if (e1.label == e2.label && e1.x < e2.x) return -1; return 1; });
  return labels;
}

function findYforAllSubRows(inp, lbls) {
  const bias = 0.2 * findMaxWidth(inp);
  let lblsY = lbls.map(l => ({ label: l, rowCenter: rowCenterY(inp, l) }));
  let minY = Number.POSITIVE_INFINITY;
  lblsY.map(o1 => {
    o1.minRowCenterStep = Number.POSITIVE_INFINITY;
    o1.minRowDistanceY = Number.POSITIVE_INFINITY;
    lblsY.map(o2 => {
      let dY = Math.abs(o1.rowCenter - o2.rowCenter);
      let dY1 = Math.abs(distYbetweenSubrows(inp, o1.label, o2.label))
      if (dY > bias && dY < o1.minRowCenterStep) {
        o1.minRowCenterStep = dY;
      }
      if (dY1 > bias && dY1 < o1.minRowDistanceY) {
        o1.minRowDistanceY = dY1;
      }
    });

  });

  let minRowCenterStep_sum = 0;
  let minRowCenterStep_count = 0;
  let minRowDistanceY_sum = 0;
  let minRowDistanceY_count = 0;
  lblsY.map(o1 => {
    if (o1.rowCenter == Number.NEGATIVE_INFINITY) {
      o1.nearestRowCenter = Number.POSITIVE_INFINITY;
      lblsY.map(o2 => {
        if (o2.rowCenter != Number.NEGATIVE_INFINITY) {
          let dist = distYbetweenSubrows(inp, o2.label, o1.label);
          if (Math.abs(dist) < Math.abs(o1.nearestRowCenter)) {
            o1.nearestRowCenter = dist;
            o1.nearestRowLabel = o2.label;
          }
        }
      })
    } else {
      minRowCenterStep_sum += o1.minRowCenterStep;
      minRowCenterStep_count += 1;
    }
    minRowDistanceY_sum += o1.minRowDistanceY;
    minRowDistanceY_count += 1;
  });
  let avgRowCenterStep = minRowCenterStep_sum / minRowCenterStep_count;
  let avgRowDistanceY = minRowDistanceY_sum / minRowDistanceY_count;
  lblsY.map(o1 => {
    if (o1.rowCenter == Number.NEGATIVE_INFINITY) {
      lblsY.map(o2 => {
        if (o2.label == o1.nearestRowLabel) {
          o1.rowCenter = o2.rowCenter + avgRowCenterStep * (o1.nearestRowCenter / avgRowDistanceY);
        }
      });
    }
  });
  lblsY.map(o1 => {
    let y = o1.rowCenter;
    if (y < minY) {
      minY = y;
    }
  });
  return lblsY.map(o => ({
    label: o.label,
    newY: Math.round((o.rowCenter - minY) / avgRowCenterStep)
  }));
}

/*function checkSubRow(subrow, minX, divider) {
  for (let i=0; i<subrow.length; i++) {
    subrow[i].newX = Math.round((subrow[i].x - minX) / divider);
    if (i>0) {
      if (subrow[i].newX == subrow[i-1].newX) {
        return false;
      }
    }
  }
  return true;
}*/

function convertForeignGridToLocalGrid(inp) {
  setIndex(inp); // preserve initial index

  let lbls = detectSubRows(inp); //after this call inp is reordered

  lbls = findYforAllSubRows(inp, lbls);
  
  let divider = findMinWidth(inp) / 2;
  let { minX } = findCenterX(inp);

  inp.map(el => {
    lblEl = lbls.find(l => l.label == el.label);
    el.newY = lblEl.newY;
    el.newX = Math.round((el.x - minX) / divider);
  });

  


  return inp.map(e => ({
    x: e.newX,
    y: e.newY
  }));
}

module.exports = (seats) => {
  return convertForeignGridToLocalGrid(seats);
};