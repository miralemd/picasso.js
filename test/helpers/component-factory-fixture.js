import componentFactory from '../../src/core/component/component-factory';

export default function componentFactoryFixture() {
  let comp;
  let chartMock;
  let rendererMock;
  let rendererOutput = [];
  const sandbox = sinon.sandbox.create();

  const fn = function func() {
    chartMock = {
      brush: () => ({
        on: () => {}
      }),
      scale: sandbox.stub(),
      dataset: sandbox.stub(),
      table: sandbox.stub(),
      container: sandbox.stub(),
      formatter: sandbox.stub()
    };

    rendererMock = {
      size: () => ({ width: 100, height: 100 }),
      render: (nodes) => { rendererOutput = nodes; },
      appendTo: () => {},
      measureText: ({ text }) => ({
        width: text.toString().length,
        height: 5
      })
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
      renderer: rendererMock
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
