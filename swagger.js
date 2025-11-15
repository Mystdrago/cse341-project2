const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Conacts Api',
        description: 'Contacts Api'
    },
    host: 'localhost:3001',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFile = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFile, doc);