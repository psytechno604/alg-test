const fs = require('fs');
const sampleData = require('./sample-input.json');
const convertForeignGridToLocalGrid = require('./convertForeignGridToLocalGrid');
const {
  createCoordinateGridMember,
  drawCoordinateGrid
} = require('coordinate-grid');

const localGrid = sampleData.map(inp => convertForeignGridToLocalGrid(inp));

localGrid.map(out => {
  console.log('-----------------------------------------------------------------');
  console.log(
    drawCoordinateGrid(
      out.map((seat) => {
        return createCoordinateGridMember(seat.x, seat.y, 'x')
      }), ' '
    )
  );
});