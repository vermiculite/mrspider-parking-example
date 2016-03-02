var mrspiderValidator = require('mrspider-validator');
var mongodbPersister = require('mrspider-mongodb-persister');

module.exports = function() {
    return mrspiderValidator({
        url: {
            type: 'string',
            required: true
        },
        title: {
            type: 'string',
            required: true
        },
        price: {
            type: 'string',
            required: true
        },
        detail: {
            type: 'string'
        },
        images: {
            type: 'array'
        },
        lat: {
            type: 'number'
        },
        lng: {
            type: 'number'
        }
    }).pipe(mongodbPersister({
        url: `mongodb://${process.env.IP}:27017/parking`,
        collection: 'results'
    }));

};
