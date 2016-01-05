"use strict";

var mrspiderRequest = require('mrspider-request');
var mrspiderCheerio = require('mrspider-cheerio');
var mrspiderCssLinks = require('mrspider-css-links');
var mrspiderCssData = require('mrspider-css-data-extractor');
var mrspiderCssImage = require('mrspider-css-image-extraction');
var regexDataExtractor = require('mrspider-regex-data-extractor');
var mrspiderValidator = require('mrspider-validator');
var mongodbPersister = require('mrspider-mongodb-persister');
var spider = require('mrspider')({
    baseUrl: 'http://www.fotocasa.es'
});

const LINKS_RULE = '.pagination-next a, .property-location';

spider.use(mrspiderRequest);

spider.use(mrspiderCheerio);

spider.use(mrspiderCssLinks(LINKS_RULE));

spider.use(mrspiderCssData({
    title: 'h1.property-title',
    price: '.basic-info--contact_price',
    detail: '.detail-section-content'
}));

spider.use(mrspiderCssImage({
    images: 'li.carousel_slide > img'
}));

spider.use(regexDataExtractor({
    lat: /Lat": "(\d+\.\d+)/,
    lng: /Lng": "(\d+\.\d+)/
}));

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

spider.use(function(page, spider, next) {
    console.log(page.url);
    console.log(page.data);
    next();
});

spider.addUrl('http://www.fotocasa.es/alquiler/garajes/barcelona-provincia/listado-por-foto/');

spider.crawl();
