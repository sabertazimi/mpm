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

  it('fetchPackage', () => {
    expect.assertions(2);
    return mpm.fetchPackage({
      name: 'react',
      reference: '16.4.0'
    }).then((buffer) => {
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(255);
    });
  });
});
