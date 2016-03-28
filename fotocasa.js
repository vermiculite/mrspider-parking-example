"use strict";



let through2 = require('through2');
let mr = require('mrspider');

let spider = mr.Spider({
    baseUrl: 'http://www.fotocasa.es'
});
let mrspiderRequest = mr.request();
let mrspiderCheerio = mr.cheerio;
let mrspiderJsdom = mr.jsdom();
let mrspiderCssLinks = mr.cssLinks;
let mrspiderCssData = mr.cssDataExtractor;
let mrspiderCssImage = mr.cssImageExtraction;
let persistence = require('./persistence');
let regexDataExtractor = mr.regexDataExtractor;


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
        next();
    }));



