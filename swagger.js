const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Players and Monsters Api',
        description: 'RPG Api'
    },
    host: 'localhost:3001',
    schemes: ['http', 'https'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Enter your bearer token in the format **Bearer &lt;token&gt;**'
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ]
};

const outputFile = './swagger.json';
const endpointsFile = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFile, doc);