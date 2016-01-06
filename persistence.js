var mrspiderValidator = require('mrspider-validator');
var mongodbPersister = require('mrspider-mongodb-persister');

module.exports = function(spider) {
    spider.use(mrspiderValidator({
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
    }));

    spider.use(mongodbPersister({
        url: 'mongodb://localhost:27017/parking',
        collection: 'results'
    }));

};
