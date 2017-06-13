import componentFactoryFixture from '../../../../helpers/component-factory-fixture';
import brushAreaDir from '../../../../../src/web/components/brush-range/brush-area-dir';
import elementMock from '../../../../mocks/element-mock';
import vDomMock from '../../../../mocks/vDom-mock';

describe('Brush Area Directional', () => {
  let componentFixture;
  let instance;
  let config;
  let rendererOutput;
  let chartMock;
  let sandbox;
  let size;

  beforeEach(() => {
    size = {
      inner: { x: 0, y: 0, width: 100, height: 150 },
      outer: { x: 0, y: 0, width: 100, height: 150 }
    };

    global.document = {
      elementFromPoint: sinon.stub(),
      createElement: sinon.stub().returns({ bind: elementMock })
    };

    componentFixture = componentFactoryFixture();
    config = {
      settings: {
        direction: 'horizontal',
        target: null // Remove target to reduce complexity and dependencies on other components
      }
    };

    sandbox = componentFixture.sandbox();
    chartMock = componentFixture.mocks().chart;
    chartMock.shapesAt = sandbox.stub().returns([]);
    chartMock.brushFromShapes = sandbox.stub();
    componentFixture.mocks().renderer.renderArgs = [vDomMock];
  });

  afterEach(() => {
    delete global.document;
  });

  describe('should renderer', () => {
    describe('horizontal', () => {
      beforeEach(() => {
        instance = componentFixture.simulateCreate(brushAreaDir, config);
        componentFixture.simulateRender(size);
        instance.def.start({ center: { x: 0, y: 0 }, deltaX: 0, deltaY: 0 });
        instance.def.move({ center: { x: 100, y: 0 }, deltaX: 0, deltaY: 0 });
        instance.def.end({ center: { x: 50, y: 0 }, deltaX: 0, deltaY: 0 });
        rendererOutput = componentFixture.getRenderOutput();
      });

      it('left edge node correctly', () => {
        const edgeLeft = rendererOutput[0];

        // Work-around to deal with deep equal on objects with functions
        expect(edgeLeft.data.on.mouseover).to.be.a.function;
        expect(edgeLeft.data.on.mouseout).to.be.a.function;
        delete edgeLeft.data.on.mouseover;
        delete edgeLeft.data.on.mouseout;

        const expectedEdgeLeft = {
          sel: 'div',
          data: {
            on: {},
            attrs: {
              'data-value': 0
            },
            style: {
              cursor: 'ew-resize',
              position: 'absolute',
              left: '0px',
              top: '0',
              height: '100%',
              width: '5px',
              pointerEvents: 'auto'
            }
          },
          children: [{
            sel: 'div',
            data: {
              style: {
                backgroundColor: 'rgba(50, 50, 50, 0.8)',
                position: 'absolute',
                height: '100%',
                width: '1px',
                left: '0',
                top: '0'
              }
            },
            children: []
          }]
        };
        expect(edgeLeft).to.deep.equal(expectedEdgeLeft);
      });

      it('right edge node correctly', () => {
        const edgeRight = rendererOutput[1];

        // Work-around to deal with deep equal on objects with functions
        expect(edgeRight.data.on.mouseover).to.be.a.function;
        expect(edgeRight.data.on.mouseout).to.be.a.function;
        delete edgeRight.data.on.mouseover;
        delete edgeRight.data.on.mouseout;

        const expectedEdgeRight = {
          sel: 'div',
          data: {
            on: {},
            attrs: {
              'data-value': 100
            },
            style: {
              cursor: 'ew-resize',
              position: 'absolute',
              left: '95px',
              top: '0',
              height: '100%',
              width: '5px',
              pointerEvents: 'auto'
            }
          },
          children: [{
            sel: 'div',
            data: {
              style: {
                backgroundColor: 'rgba(50, 50, 50, 0.8)',
                position: 'absolute',
                height: '100%',
                width: '1px',
                right: '0',
                bottom: '0'
              }
            },
            children: []
          }]
        };
        expect(edgeRight).to.deep.equal(expectedEdgeRight);
      });

      it('left bubble node correctly', () => {
        const bubbleLeft = rendererOutput[2];
        const expectedBubbleLeft = {
          sel: 'div',
          data: {
            style: {
              position: 'absolute',
              top: '0',
              left: '0px'
            }
          },
          children: [{
            sel: 'div',
            data: {
              attrs: {
                'data-other-value': 100,
                'data-idx': 0
              },
              style: {
                position: 'relative',
                borderRadius: '6px',
                border: '1px solid #666',
                backgroundColor: '#fff',
                padding: '5px 9px',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '150px',
                minWidth: '50px',
                minHeight: '1em',
                pointerEvents: 'auto',
                transform: 'translate(-50%,0)',
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#595959'
              }
            },
            children: ['-']
          }]
        };

        expect(bubbleLeft).to.deep.equal(expectedBubbleLeft);
      });

      it('right bubble node correctly', () => {
        const bubbleRight = rendererOutput[3];
        const expectedBubbleRight = {
          sel: 'div',
          data: {
            style: {
              position: 'absolute',
              top: '0',
              left: '100px'
            }
          },
          children: [{
            sel: 'div',
            data: {
              attrs: {
                'data-other-value': 0,
                'data-idx': 0
              },
              style: {
                position: 'relative',
                borderRadius: '6px',
                border: '1px solid #666',
                backgroundColor: '#fff',
                padding: '5px 9px',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '150px',
                minWidth: '50px',
                minHeight: '1em',
                pointerEvents: 'auto',
                transform: 'translate(-50%,0)',
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#595959'
              }
            },
            children: ['-']
          }]
        };

        expect(bubbleRight).to.deep.equal(expectedBubbleRight);
      });
    });

    describe('vertical', () => {
      beforeEach(() => {
        config.settings.direction = 'vertical';
        instance = componentFixture.simulateCreate(brushAreaDir, config);
        componentFixture.simulateRender(size);
        instance.def.start({ center: { x: 0, y: 0 }, deltaX: 0, deltaY: 0 });
        instance.def.move({ center: { x: 0, y: 150 }, deltaX: 0, deltaY: 0 });
        instance.def.end({ center: { x: 0, y: 75 }, deltaX: 0, deltaY: 0 });
        rendererOutput = componentFixture.getRenderOutput();
      });

      it('top edge node correctly', () => {
        const edgeTop = rendererOutput[0];

        // Work-around to deal with deep equal on objects with functions
        expect(edgeTop.data.on.mouseover).to.be.a.function;
        expect(edgeTop.data.on.mouseout).to.be.a.function;
        delete edgeTop.data.on.mouseover;
        delete edgeTop.data.on.mouseout;

        const expectedEdgeTop = {
          sel: 'div',
          data: {
            on: {},
            attrs: {
              'data-value': 0
            },
            style: {
              cursor: 'ns-resize',
              position: 'absolute',
              left: '0',
              top: '0px',
              height: '5px',
              width: '100%',
              pointerEvents: 'auto'
            }
          },
          children: [{
            sel: 'div',
            data: {
              style: {
                backgroundColor: 'rgba(50, 50, 50, 0.8)',
                position: 'absolute',
                height: '1px',
                width: '100%',
                left: '0',
                top: '0'
              }
            },
            children: []
          }]
        };
        expect(edgeTop).to.deep.equal(expectedEdgeTop);
      });

      it('bottom edge node correctly', () => {
        const edgeBottom = rendererOutput[1];

        // Work-around to deal with deep equal on objects with functions
        expect(edgeBottom.data.on.mouseover).to.be.a.function;
        expect(edgeBottom.data.on.mouseout).to.be.a.function;
        delete edgeBottom.data.on.mouseover;
        delete edgeBottom.data.on.mouseout;

        const expectedEdgeBottom = {
          sel: 'div',
          data: {
            on: {},
            attrs: {
              'data-value': 150
            },
            style: {
              cursor: 'ns-resize',
              position: 'absolute',
              left: '0',
              top: '145px',
              height: '5px',
              width: '100%',
              pointerEvents: 'auto'
            }
          },
          children: [{
            sel: 'div',
            data: {
              style: {
                backgroundColor: 'rgba(50, 50, 50, 0.8)',
                position: 'absolute',
                height: '1px',
                width: '100%',
                right: '0',
                bottom: '0'
              }
            },
            children: []
          }]
        };
        expect(edgeBottom).to.deep.equal(expectedEdgeBottom);
      });

      it('top bubble node correctly', () => {
        const bubbleTop = rendererOutput[2];
        const expectedBubbleTop = {
          sel: 'div',
          data: {
            style: {
              position: 'absolute',
              top: '0px',
              left: '0'
            }
          },
          children: [{
            sel: 'div',
            data: {
              attrs: {
                'data-other-value': 150,
                'data-idx': 0
              },
              style: {
                position: 'relative',
                borderRadius: '6px',
                border: '1px solid #666',
                backgroundColor: '#fff',
                padding: '5px 9px',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '150px',
                minWidth: '50px',
                minHeight: '1em',
                pointerEvents: 'auto',
                transform: 'translate(0,-50%)',
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#595959'
              }
            },
            children: ['-']
          }]
        };

        expect(bubbleTop).to.deep.equal(expectedBubbleTop);
      });

      it('bottom bubble node correctly', () => {
        const bubbleBottom = rendererOutput[3];
        const expectedBubbleBottom = {
          sel: 'div',
          data: {
            style: {
              position: 'absolute',
              top: '150px',
              left: '0'
            }
          },
          children: [{
            sel: 'div',
            data: {
              attrs: {
                'data-other-value': 0,
                'data-idx': 0
              },
              style: {
                position: 'relative',
                borderRadius: '6px',
                border: '1px solid #666',
                backgroundColor: '#fff',
                padding: '5px 9px',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '150px',
                minWidth: '50px',
                minHeight: '1em',
                pointerEvents: 'auto',
                transform: 'translate(0,-50%)',
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#595959'
              }
            },
            children: ['-']
          }]
        };

        expect(bubbleBottom).to.deep.equal(expectedBubbleBottom);
      });
    });
  });
});