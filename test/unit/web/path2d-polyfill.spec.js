import polyfillPath2D from '../../../src/web/path2d-polyfill';

function CanvasRenderingContext2D() {}
CanvasRenderingContext2D.prototype = {
  fill() {},
  stroke() {},
  beginPath() {},
  moveTo() {},
  lineTo() {},
  arc() {},
  closePath() {}
};

let window,
  ctx,
  cMock;

describe('Canvas path', () => {
  beforeEach(() => {
    window = {
      CanvasRenderingContext2D
    };
    ctx = new window.CanvasRenderingContext2D();
    cMock = sinon.mock(ctx);
    polyfillPath2D(window);
  });

  afterEach(() => {
    cMock.restore();
  });

  describe('Polyfill', () => {
    it('should add Path2D constructor to window object', () => {
      expect(new window.Path2D()).to.be.an.instanceOf(window.Path2D);
    });
  });
  describe('Render path', () => {
    it('should run moveTo and lineTo with correct coordinates', () => {
      cMock.expects('moveTo').once().withExactArgs(10, 10);
      cMock.expects('lineTo').once().withExactArgs(20, 20);
      ctx.stroke(new window.Path2D('M 10 10 L 20 20'));
      cMock.verify();
    });
    it('should run moveTo and lineTo multiple times with MLml', () => {
      cMock.expects('moveTo').twice();
      cMock.expects('lineTo').twice();
      ctx.stroke(new window.Path2D('M 10 10 l 20 5 m 5 10 l -20 -10'));
      cMock.verify();
    });
    it('should run lineTo with relative coordinates', () => {
      cMock.expects('moveTo').once().withArgs(10, 10);
      cMock.expects('lineTo').once().withArgs(15, 15);
      cMock.expects('lineTo').once().withArgs(10, 20);
      ctx.stroke(new window.Path2D('M 10 10 l 5 5 l -5 5'));
      cMock.verify();
    });
    it('should run moveTo with relative coordinates', () => {
      cMock.expects('moveTo').once().withArgs(10, 10);
      cMock.expects('moveTo').once().withArgs(15, 15);
      cMock.expects('moveTo').once().withArgs(10, 20);
      ctx.stroke(new window.Path2D('M 10 10 m 5 5 m -5 5'));
      cMock.verify();
    });
    it('should run simple arc with correct parameters', () => {
      cMock.expects('moveTo').once().withArgs(80, 80);
      cMock.expects('arc').once().withArgs(125, 80, 45, Math.PI, Math.PI / 2, true);
      cMock.expects('lineTo').once().withArgs(125, 80);
      cMock.expects('closePath').once();
      ctx.stroke(new window.Path2D('M80 80A 45 45 0 0 0 125 125L 125 80 Z'));
      cMock.verify();
    });
    it('should run sweep flag and large flag arc with relative parameters with correct parameters', () => {
      cMock.expects('arc').once().withArgs(275, 230, 45, Math.PI, Math.PI / 2, false);
      ctx.stroke(new window.Path2D('M230 230a 45 45 0 1 1 45 45L 275 230 Z'));
      cMock.verify();
    });
    it('should run closePath with Z and stroke', () => {
      cMock.expects('closePath').once();
      ctx.stroke(new window.Path2D('M 16 90 L13 37 L3 14 Z'));
      cMock.verify();
    });

    it('should run closePath with z and fill', () => {
      cMock.expects('closePath').once();
      ctx.fill(new window.Path2D('M 16 90 L13 37 L3 14 z'));
      cMock.verify();
    });
  });
});