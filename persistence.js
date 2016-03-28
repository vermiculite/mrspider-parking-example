"use strict";

let mr = require('mrspider');
let mrspiderValidator = mr.validator;
let mongodbPersister = mr.mongoDbPersister;

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
