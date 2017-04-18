import componentFactory from '../../src/core/component/component-factory';
import elementMock from '../mocks/element-mock';

export default function componentFactoryFixture() {
  let comp;
  let chartMock;
  let rendererMock;
  let rendererOutput = [];
  let mediatorMock;
  const sandbox = sinon.sandbox.create();
  const container = elementMock();

  const fn = function func() {
    chartMock = {
      brush: () => ({
        on: () => {}
      }),
      scale: sandbox.stub(),
      dataset: sandbox.stub(),
      table: sandbox.stub(),
      container: sandbox.stub(),
      formatter: sandbox.stub(),
      element: elementMock()
    };

    rendererMock = {
      size: () => ({ width: 100, height: 100 }),
      render: (nodes) => { rendererOutput = nodes; },
      appendTo: () => {},
      measureText: ({ text }) => ({
        width: text.toString().length,
        height: 5
      }),
      element: () => container
    };

    mediatorMock = {
      on: sandbox.stub()
    };

    return fn;
  };

  fn.mocks = () => ({
    chart: chartMock,
    renderer: rendererMock
  });

  fn.simulateCreate = (componentDef, settings) => {
    comp = componentFactory(componentDef, {
      settings,
      chart: chartMock,
      renderer: rendererMock,
      mediator: mediatorMock
    });

    return comp;
  };

  fn.simulateRender = (opts) => {
    const {
      inner,
      outer
    } = opts;

    comp.beforeMount();
    comp.resize(inner, outer);
    comp.beforeRender();
    comp.render();
    comp.mounted();

    return rendererOutput;
  };

  fn.simulateUpdate = (settings) => {
    comp.set({ settings });
    comp.beforeUpdate();
    comp.beforeRender();
    comp.update();
    comp.updated();

    return rendererOutput;
  };

  fn.getRenderOutput = () => rendererOutput;

  fn.sandbox = () => sandbox;

  fn.instance = () => comp;

  return fn();
}
