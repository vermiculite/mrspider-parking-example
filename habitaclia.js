"use strict";
let through2 = require('through2');

let mr = require('mrspider')
let spider = mr.Spider({
    baseUrl: 'http://www.habitaclia.com'
});

let mrspiderRequest = mr.request();
let mrspiderCheerio = mr.cheerio;
let mrspiderJsdom = mr.jsdom();
let mrspiderCssLinks = mr.cssLinks;
let mrspiderCssData = mr.cssDataExtractor;
let mrspiderCssImage = mr.cssImageExtraction;
let persistence = require('./persistence');
let regexDataExtractor = mr.regexDataExtractor;



spider.addUrl('http://www.habitaclia.com/alquiler-aparcamientos-barcelona.htm');

spider.createReadStream()
    .pipe(mrspiderRequest)
    .pipe(mrspiderCheerio)
    .pipe(mrspiderCssLinks('.paginacionlista a:last-child, h3 a'))
    .pipe(mrspiderCssData({
        title: 'title',
        price: '#opciones-top li.precio',
        detail: 'div[itemprop=description]'
    }))
    .pipe(mrspiderCssImage({
        images: 'img[itemprop=image]'
    })).pipe(regexDataExtractor({
        lat: /Lat: parseFloat\((\d+\.\d+)/,
        lng: /Lon: parseFloat\((\d+\.\d+)/
    }))
    .pipe(persistence())
    .pipe(through2.obj(function(page, encoding, next) {
        console.log(page.url);
        console.log(page.data);
        next();
    }));
