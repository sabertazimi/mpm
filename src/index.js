const Mpm = require('./mpm.js');
const mpm = new Mpm();

mpm.fetchPackage({
    name: 'react',
    reference: '16.4.0'
}).then(buffer => console.log(buffer));
