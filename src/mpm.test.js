const mpm = require('./mpm.js');

describe('Mpm Utils', () => {
  it('getPinnedReference ~version', () => {
    expect.assertions(2);
    return mpm.getPinnedReference({
      name: 'react',
      reference: '~15.3.0'
    }).then(({ name, reference }) => {
      expect(name).toBe('react');
      expect(reference).toBe('15.3.2');
    });
  });
  
  it('getPinnedReference version', () => {
    expect.assertions(2);
    return mpm.getPinnedReference({
      name: 'react',
      reference: '15.3.0'
    }).then(({ name, reference }) => {
      expect(name).toBe('react');
      expect(reference).toBe('15.3.0');
    });
  });
  
  it('getPinnedReference not version', () => {
    expect.assertions(2);
    return mpm.getPinnedReference({
      name: 'react',
      reference: '/tmp/react-15.3.2.tar.gz'
    }).then(({ name, reference }) => {
      expect(name).toBe('react');
      expect(reference).toBe('/tmp/react-15.3.2.tar.gz');
    });
  });
  
  it('getPinnedReference not found pacakge', () => {
    expect.assertions(1);
    return mpm.getPinnedReference({
      name: 'reacttt',
      reference: '~15.3.0'
    }).catch((error) => {
      expect(error).toEqual(new Error(`Couldn't fetch package "reacttt"`));
    });
  });
  
  it('getPinnedReference not found version', () => {
    expect.assertions(1);
    return mpm.getPinnedReference({
      name: 'react',
      reference: '~99.0.0'
    }).catch((error) => {
      expect(error).toEqual(new Error(`Couldn't find a version matching "~99.0.0" for package  "react"`));
    });
  });
  
  it('fetchPackage react-16.4.0', () => {
    expect.assertions(2);
    return mpm.fetchPackage({
      name: 'react',
      reference: '16.4.0'
    }).then((buffer) => {
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(255);
    });
  });
  
  it('fetchPackage local file', () => {
    expect.assertions(2);
    return mpm.fetchPackage({
      name: 'mpm',
      reference: './src/mpm.js'
    }).then((buffer) => {
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(255);
    });
  });
  
  it('fetchPackage not found package', () => {
    expect.assertions(1);
    return mpm.fetchPackage({
      name: 'react',
      reference: '99.0.0'
    }).catch((error) => {
      expect(error instanceof Error).toBe(true);
    });
  });
  
  it('getPackageDependencies react-16.4.0', () => {
    expect.assertions(4);
    return mpm.getPackageDependencies({
      name: 'react',
      reference: '16.4.0'
    }).then(({ dependencies, devDependencies }) => {
      expect(Array.isArray(dependencies)).toBe(true);
      expect(Array.isArray(devDependencies)).toBe(true);
      expect(dependencies.length).toBeGreaterThan(3);
      expect(devDependencies.length).toBe(0);
    });
  });

  it('getPackageDependencies semver-5.5.0', () => {
    expect.assertions(4);
    return mpm.getPackageDependencies({
      name: 'semver',
      reference: '5.5.0'
    }).then(({ dependencies, devDependencies }) => {
      expect(Array.isArray(dependencies)).toBe(true);
      expect(Array.isArray(devDependencies)).toBe(true);
      expect(dependencies.length).toBe(0);
      expect(devDependencies.length).toBe(1);
    });
  });

  it('getPackageDependencyTree mpm-0.1.0', () => {
    jest.setTimeout(30000);    
    const packageDependencies = [{
      name: 'semver',
      reference: '5.5.0'
    }];
    expect.assertions(3);
    return mpm.getPackageDependencyTree({
      name: 'mpm',
      reference: null,
      dependencies: packageDependencies
    }).then(({ name, reference, dependencies }) => {
      expect(name).toBe('mpm');
      expect(Array.isArray(dependencies)).toBe(true);
      expect(dependencies.length).toBe(1);
    });
  });
});
