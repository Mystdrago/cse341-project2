const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Players and Monsters Api',
        description: 'RPG Api'
    },
    host: 'localhost:3001',  // Change this to your Render URL in production
    schemes: ['http', 'https'],
    definitions: {
        Monster: {
            name: "any",
            level: "any",
            size: "any",
            types: "any",
            healthPoints: "any",
            staminaPoints: "any",
            attentionPoints: "any",
            luckyPoints: "any"
        },
        Player: {
            name: "any",
            level: "any",
            size: "any",
            species: "any",
            types: "any",
            healthPoints: "any",
            staminaPoints: "any",
            attentionPoints: "any",
            luckyPoints: "any"
        }
    }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger JSON generated successfully.');
});