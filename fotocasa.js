"use strict";

var mrspiderRequest = require('mrspider-request')();
var mrspiderCheerio = require('mrspider-cheerio');
var mrspiderJsdom = require('mrspider-jsdom')();
var mrspiderCssLinks = require('mrspider-css-links');
var mrspiderCssData = require('mrspider-css-data-extractor');
var mrspiderCssImage = require('mrspider-css-image-extraction');
"use strict";

let through2 = require('through2');
var persistence = require('./persistence');
var regexDataExtractor = require('mrspider-regex-data-extractor');
var spider = require('mrspider')({
    baseUrl: 'http://www.fotocasa.es'
});

const LINKS_RULE = '.pagination-next a, .property-location';

spider.addUrl('http://www.fotocasa.es/alquiler/garajes/barcelona-provincia/listado-por-foto/');


spider.createReadStream()
    .pipe(mrspiderRequest)
    .pipe(mrspiderJsdom)
    .pipe(mrspiderCssLinks(LINKS_RULE))
    .pipe(mrspiderCssImage({
        images: 'li.carousel_slide > img'
    }))
    .pipe(mrspiderCssData({
        title: 'h1.property-title',
        price: '.basic-info--contact_price',
        detail: '.detail-section-content'
    }))
    .pipe(regexDataExtractor({
        lat: /Lat": "(\d+\.\d+)/,
        lng: /Lng": "(\d+\.\d+)/
    }))
    .pipe(persistence())
    .pipe(through2.obj(function(page, enc, next) {
        console.log(page.url);
        console.log(page.data);
        this.push(page)
        next();
    }));


