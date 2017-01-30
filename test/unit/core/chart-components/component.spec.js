/* eslint-disable no-unused-expressions */

import componentFactory from '../../../../src/core/chart-components/component';

describe('Component', () => {
  let customComponent;
  let created;
  let mounted;
  let beforeRender;
  let render;
  let beforeUpdate;
  let updated;
  let composerMock;

  beforeEach(() => {
    composerMock = {
      renderer: {
        appendTo: () => {},
        render: () => ({}),
        size: () => {}
      },
      brush: () => ({
        on: () => {}
      }),
      container: () => ({}),
      table: () => ({}),
      dataset: () => ({}),
      scale: sinon.stub()
    };
    created = sinon.spy();
    mounted = sinon.spy();
    beforeRender = sinon.spy();
    render = sinon.spy();
    beforeUpdate = sinon.spy();
    updated = sinon.spy();
    customComponent = componentFactory({
      defaultSettings: {
        dock: 'top',
        style: {
          strokeWidth: 5
        },
        key1: 'value1'
      },
      created,
      mounted,
      beforeRender,
      render,
      beforeUpdate,
      updated
    });
  });

  it('should only call the created lifecycle method', () => {
    const instance = customComponent({
      key1: 'override',
      key2: false
    }, composerMock)();
    expect(created).to.have.been.called.once;
    expect(created.thisValues[0].data).to.deep.equal([]);
    expect(created.thisValues[0].settings).to.deep.equal({
      dock: 'top',
      style: {
        strokeWidth: 5
      },
      key1: 'override',
      key2: false
    });
    expect(created.thisValues[0].update).to.equal(instance.update);
    expect(mounted).to.not.have.been.called;
    expect(beforeRender).to.not.have.been.called;
    expect(render).to.not.have.been.called;
  });

  it('should call lifecycle methods when rendering', () => {
    const instance = customComponent({}, composerMock)();
    instance.resize();
    instance.render();

    expect(mounted).to.have.been.called.once;
    expect(beforeRender).to.have.been.called.once;
    expect(render).to.have.been.called.once;
  });

  it('should call lifecycle methods when updating', () => {
    const instance = customComponent({}, composerMock)();
    instance.resize();
    instance.render();
    instance.beforeUpdate();
    instance.update();

    expect(mounted).to.have.been.called.once;
    expect(beforeRender).to.have.been.called.once;
    expect(beforeUpdate).to.have.been.called.once;
    expect(updated).to.have.been.called.once;
    expect(render).to.have.been.called.twice;
  });
});
