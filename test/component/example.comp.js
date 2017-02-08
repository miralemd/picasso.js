/* global browser, protractor, by, element, $ */

describe('Example component test', () => {
  let url = 'test/component/example.fix.html';

  beforeEach(() => {
    browser.get(url);
  });

  it('Test example', () => {
    let bar = $('rect[fill="steelblue"]');
    bar.click();

    let bars = element.all(by.css('rect[fill="steelblue"]'));
    expect(bars.get(1).getAttribute('opacity')).to.eventually.equal('0.3');
    // browser.driver.sleep(1000);
  });
});
