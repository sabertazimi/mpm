const Mpm = require('./mpm.js');

describe('Mpm Utils', () => {
  const mpm = new Mpm();

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
});
