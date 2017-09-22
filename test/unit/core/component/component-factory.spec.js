import componentFactory from '../../../../src/core/component/component-factory';

describe('Component', () => {
  let definition;
  let created;
  let beforeMount;
  let mounted;
  let beforeRender;
  let render;
  let beforeUpdate;
  let updated;
  let resize;
  let chart;
  let renderer;

  beforeEach(() => {
    chart = {
      brush: () => ({
        on: () => {}
      }),
      container: () => ({}),
      table: () => ({}),
      dataset: () => ({}),
      scale: sinon.stub()
    };
    created = sinon.spy();
    beforeMount = sinon.spy();
    mounted = sinon.spy();
    beforeRender = sinon.spy();
    render = sinon.spy();
    beforeUpdate = sinon.spy();
    updated = sinon.spy();
    resize = sinon.spy();
    definition = {
      defaultSettings: {
        dock: 'top',
        style: {
          strokeWidth: 5
        },
        key1: 'value1'
      },
      created,
      beforeMount,
      mounted,
      beforeRender,
      render,
      resize,
      beforeUpdate,
      updated
    };
    renderer = {
      appendTo: () => {},
      render: () => ({}),
      size: () => {}
    };
  });

  function createAndRenderComponent(config) {
    const instance = componentFactory(definition, {
      settings: config,
      chart,
      renderer,
      styler: {
        resolve: sinon.stub()
      }
    });
    instance.beforeMount();
    instance.resize({});
    instance.beforeRender();
    instance.render();
    instance.mounted();
    return instance;
  }

  it('should call lifecycle methods with correct context when rendering', () => {
    /* const config = {
      key1: 'override',
      key2: false
    };
    const expectedContext = {
      settings: {
        dock: 'top',
        style: {
          strokeWidth: 5
        },
        key1: 'override',
        key2: false
      },
      data: []
    };*/

    createAndRenderComponent();

    expect(created).to.have.been.called.once;
    expect(resize).to.have.been.called.once;
    expect(beforeRender).to.have.been.called.once;
    expect(render).to.have.been.called.once;
    expect(resize).to.have.been.called.once;
    expect(mounted).to.have.been.called.once;
  });

  it('should call lifecycle methods with correct context when updating', () => {
    const instance = createAndRenderComponent();
    instance.set();
    instance.beforeUpdate();
    instance.resize();
    instance.beforeRender();
    instance.render();
    instance.updated();

    expect(mounted).to.have.been.called.once;
    expect(beforeRender).to.have.been.called.twice;
    expect(beforeUpdate).to.have.been.called.twice;
    expect(updated).to.have.been.called.once;
    expect(render).to.have.been.called.twice;
  });

  /*
  it('should call lifecycle methods with correct context when updating with partial data', () => {
  });
  */
});
