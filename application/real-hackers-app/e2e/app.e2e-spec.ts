import { AngularTestPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('Starting tests for real-hackers-app', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be real-hackers-app', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('real-hackers-app');
    })
  });

  it('navbar-brand should be real-hackers-flow@0.0.1',() => {
    var navbarBrand = element(by.css('.navbar-brand')).getWebElement();
    expect(navbarBrand.getText()).toBe('real-hackers-flow@0.0.1');
  });

  
    it('Application component should be loadable',() => {
      page.navigateTo('/Application');
      var assetName = browser.findElement(by.id('assetName'));
      expect(assetName.getText()).toBe('Application');
    });

    it('Application table should have 9 columns',() => {
      page.navigateTo('/Application');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(9); // Addition of 1 for 'Action' column
      });
    });

  

});
