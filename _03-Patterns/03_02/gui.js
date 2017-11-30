let options = {
  minimumSquareSizePx: 7,
  randomThreshold: 0.9,
  randomSeed: 1337,
  squareFillColor: [0, 0, 0], //RGB
  squareLineColor: [150, 165, 165], //RGB
  backgroundColor: [150, 165, 165], //RGB
  size: 600,
};

window.onload = function()
{
  let gui = new dat.GUI();
  gui.add(options, 'minimumSquareSizePx').min(1).max(100).step(1);
  gui.add(options, 'randomSeed').min(1).max(10000).step(1);
  gui.add(options, 'randomThreshold').min(0.0).max(1).step(0.01);
  gui.addColor(options, 'squareFillColor');
  gui.addColor(options, 'squareLineColor');
  gui.addColor(options, 'backgroundColor');
};