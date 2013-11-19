'use strict';

describe('Service: MoleculeRenderer', function () {

  // load the service's module
  beforeEach(module('mctApp'));

  // instantiate service
  var MoleculeRenderer;
  beforeEach(inject(function (_MoleculeRenderer_) {
    MoleculeRenderer = _MoleculeRenderer_;
  }));

  it('should do something', function () {
    expect(!!MoleculeRenderer).toBe(true);
  });

});
