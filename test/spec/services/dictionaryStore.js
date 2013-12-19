'use strict';

describe('Service: Dictionarystore', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var DictionaryStore;
  beforeEach(inject(function (_DictionaryStore_) {
    DictionaryStore = _DictionaryStore_;
  }));

  it('should do something', function () {
    expect(!!DictionaryStore).toBe(true);
  });

});
