import { styler } from '../../../../src/core/chart-components/brushing';

describe('Brushing', () => {
  describe('Styler', () => {
    let dummyComponent;
    let consume;
    let nodes;
    let brusherStub;

    beforeEach(() => {
      nodes = [
        {
          type: 'rect',
          fill: 'yellow',
          stroke: 'pink',
          data: 0
        },
        {
          type: 'rect',
          fill: 'yellow',
          stroke: 'pink',
          data: 1
        }
      ];

      dummyComponent = {
        composer: {
          brush: sinon.stub()
        },
        data: [
          { self: 0 },
          { self: 1 }
        ],
        renderer: {
          render: sinon.spy()
        },
        nodes
      };

      brusherStub = {
        listeners: [],
        containsMappedData: sinon.stub(),
        on: function on(key, fn) {
          const obj = {};
          obj[key] = fn;
          this.listeners.push(obj);
        },
        trigger: function trigger(key) {
          this.listeners
          .filter(listener => typeof listener[key] !== 'undefined')
          .forEach(listener => listener[key]());
        }
      };
      brusherStub.containsMappedData.onCall(0).returns(false); // Do not match first node but all after
      brusherStub.containsMappedData.returns(true);
      dummyComponent.composer.brush.returns(brusherStub);

      consume = {
        context: 'test',
        style: {
          inactive: {
            fill: 'inactiveFill'
          },
          active: {
            stroke: 'activeStroke'
          }
        }
      };
    });

    it('start should store all original styling values', () => {
      styler(dummyComponent, consume);
      brusherStub.trigger('start');

      dummyComponent.renderer.render.args[0][0].forEach((node) => {
        expect(node.__style).to.deep.equal({
          fill: 'yellow',
          stroke: 'pink'
        });
      });
    });

    it('end should restore all original styling values', () => {
      styler(dummyComponent, consume);
      brusherStub.trigger('start');
      brusherStub.trigger('end');

      dummyComponent.renderer.render.args[0][0].forEach((node) => {
        expect(node.__style).to.equal(undefined);
      });
    });

    it('update should apply styling values', () => {
      styler(dummyComponent, consume);
      brusherStub.trigger('update');

      const output = dummyComponent.renderer.render.args[0][0];
      expect(output[0].stroke).to.equal('pink'); // Inactive
      expect(output[0].fill).to.equal('inactiveFill');
      expect(output[1].stroke).to.equal('activeStroke'); // Active
      expect(output[1].fill).to.equal('yellow');
    });

    it('update should apply styling values only to shape nodes', () => {
      nodes.push(
        {
          type: 'container',
          stroke: 'doNotUpdate',
          fill: 'doNotUpdate',
          children: [
            {
              type: 'circle',
              fill: 'yellow',
              stroke: 'updateThis',
              data: 0
            },
            {
              type: 'container',
              children: [
                {
                  type: 'line',
                  fill: 'yellow',
                  stroke: 'updateThis',
                  data: 0
                }
              ]
            }
          ]
        }
      );
      styler(dummyComponent, consume);
      brusherStub.trigger('update');

      const output = dummyComponent.renderer.render.args[0][0];
      expect(output[0].stroke).to.equal('pink'); // Inactive
      expect(output[0].fill).to.equal('inactiveFill');
      expect(output[1].stroke).to.equal('activeStroke'); // Active
      expect(output[1].fill).to.equal('yellow');
      expect(output[2].stroke).to.equal('doNotUpdate'); // Active but not affected because type is container
      expect(output[2].fill).to.equal('doNotUpdate');
      expect(output[2].children[0].stroke).to.equal('activeStroke'); // Active because it's parent is affected
      expect(output[2].children[1].stroke).to.equal(undefined); // Active but not affected because type is container
      expect(output[2].children[1].fill).to.equal(undefined);
      expect(output[2].children[1].children[0].stroke).to.equal('activeStroke'); // Active because it's parent is affected
      expect(output[2].children[1].children[0].fill).to.equal('yellow');
    });
  });
});
