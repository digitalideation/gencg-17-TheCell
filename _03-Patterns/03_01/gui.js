let options = {
  minimumSquareSizePx: 10,
  squareFillColor: [255, 120, 0], //RGB
};

window.onload = function()
{
  let gui = new dat.GUI();
  gui.add(options, 'minimumSquareSizePx').min(1).max(100).step(1);
  gui.addColor(options, 'squareFillColor');
};