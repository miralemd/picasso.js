import chart from '../../../../src/core/charts/chart';
import elementMock from '../../../mocks/element-mock';

describe('Chart', () => {
  describe('lifecycle methods', () => {
    let created;
    let beforeMount;
    let mounted;
    let beforeRender;
    let beforeUpdate;
    let updated;
    let beforeDestroy;
    let destroyed;
    let element;
    let definition;
    let context;

    beforeEach(() => {
      created = sinon.spy();
      beforeMount = sinon.spy();
      mounted = sinon.spy();
      beforeRender = sinon.spy();
      beforeUpdate = sinon.spy();
      updated = sinon.spy();
      beforeDestroy = sinon.spy();
      destroyed = sinon.spy();

      element = elementMock();

      definition = {
        element,
        settings: {
          scales: {},
          components: [],
          data: {}
        },
        on: {
          click: sinon.spy()
        },
        created,
        beforeMount,
        mounted,
        beforeRender,
        beforeUpdate,
        updated,
        beforeDestroy,
        destroyed
      };

      context = {
        registries: {
          data: () => () => ({})
        }
      };
    });

    it('should call lifecycle methods when rendering', () => {
      chart(definition, context);
      // const expectedThis = {
      //   ...definition
      // };
      expect(created, 'created').to.have.been.called.once;
      // expect(created.thisValues[0], 'created context').to.deep.equal(expectedThis);
      expect(beforeRender, 'beforeRender').to.have.been.called.once;
      expect(beforeMount, 'beforeMount').to.have.been.called.once;
      expect(mounted, 'mounted').to.have.been.called.once;
      expect(updated, 'updated').to.not.have.been.called;
    });

    it('should register event listeners when rendering', () => {
      expect(element.listeners.length).to.equal(0);
      chart(definition, context);
      expect(element.listeners.length).to.equal(4); // Click listener + 3 brush listeners
    });

    it('should call lifecycle methods when updating', () => {
      const chartInstance = chart(definition, context);
      chartInstance.update();
      expect(created, 'created').to.have.been.called.once;
      expect(beforeRender, 'beforeRender').to.have.been.called.twice;
      expect(beforeUpdate, 'beforeUpdate').to.have.been.called.twice;
      expect(beforeMount, 'beforeMount').to.have.been.called.once;
      expect(mounted, 'mounted').to.have.been.called.once;
      expect(updated, 'updated').to.have.been.called.once;
    });

    it('should call lifecycle methods when destroying', () => {
      const chartInstance = chart(definition, context);
      chartInstance.destroy();
      expect(created, 'created').to.have.been.called.once;
      expect(beforeRender, 'beforeRender').to.have.been.called.once;
      expect(beforeMount, 'beforeMount').to.have.been.called.once;
      expect(mounted, 'mounted').to.have.been.called.once;
      expect(beforeDestroy, 'beforeDestroy').to.have.been.called.once;
      expect(destroyed, 'destroyed').to.have.been.called.once;
      expect(element.listeners.length).to.equal(0);
    });
  });
});
