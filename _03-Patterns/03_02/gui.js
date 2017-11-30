let options = {
  minimumSquareSizePx: 7,
  randomThreshold: 0.9,
  randomSeed: 1337,
  squareFillColor: [0, 0, 0], //RGB
  squareLineColor: [150, 165, 165], //RGB
  backgroundColor: [150, 165, 165], //RGB
  size: 600,
};

window.somethingChanged = true;
let controllers = [];

window.onload = function()
{
  window.gui = new dat.GUI();
  controllers.push(window.gui.add(options, 'minimumSquareSizePx').min(1).max(100).step(1));
  controllers.push(window.gui.add(options, 'randomSeed').min(1).max(10000).step(1));
  controllers.push(window.gui.add(options, 'randomThreshold').min(0.0).max(1).step(0.01));
  controllers.push(window.gui.addColor(options, 'squareFillColor'));
  controllers.push(window.gui.addColor(options, 'squareLineColor'));
  controllers.push(window.gui.addColor(options, 'backgroundColor'));

  controllers.forEach( function(element, index, arr)
  {
    element.onChange( function (value)
    {
      window.somethingChanged = true;
    });
  });
};
