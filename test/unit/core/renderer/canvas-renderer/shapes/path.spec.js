import { render } from '../../../../../../src/web/renderer/canvas-renderer/shapes/path';

let g;
let gMock;
describe('Canvas path', () => {
  beforeEach(() => {
    g = {
      beginPath: () => { },
      moveTo: () => { },
      lineTo: () => { },
      stroke: () => { }
    };
    gMock = sinon.mock(g);
  });

  afterEach(() => {
    gMock.restore();
  });

  describe('Render path', () => {
    it('should run moveTo and lineTo with correct coordinates', () => {
      gMock.expects('moveTo').once().withExactArgs(10, 10);
      gMock.expects('lineTo').once().withExactArgs(20, 20);
      render({ d: 'M 10 10 L 20 20' }, { g, doStroke: true });
      gMock.verify();
    });
    it('should run moveTo and lineTo multiple times with MLml', () => {
      gMock.expects('moveTo').twice();
      gMock.expects('lineTo').twice();
      render({ d: 'M 10 10 l 20 5 m 5 10 l -20 -10' }, { g, doStroke: true });
      gMock.verify();
    });
    it('should run lineTo with relative coordinates', () => {
      gMock.expects('moveTo').once().withArgs(10, 10);
      gMock.expects('lineTo').once().withArgs(30, 5);
      render({ d: 'M 10 10 l 20 -5' }, { g, doStroke: true });
      gMock.verify();
    });
    it('should run moveTo with relative coordinates', () => {
      gMock.expects('moveTo').once().withArgs(10, 10);
      gMock.expects('moveTo').once().withArgs(5, 30);
      render({ d: 'M 10 10 m -5 20' }, { g, doStroke: true });
      gMock.verify();
    });
  });
});
