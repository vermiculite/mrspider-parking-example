"use strict";
let through2 = require('through2');

var mrspiderRequest = require('mrspider-request')({
    encoding: 'binary'
});
var mrspiderCheerio = require('mrspider-cheerio');
var mrspiderCssLinks = require('mrspider-css-links');
var mrspiderCssData = require('mrspider-css-data-extractor');
var mrspiderCssImage = require('mrspider-css-image-extraction');
var regexDataExtractor = require('mrspider-regex-data-extractor');
var persistence = require('./persistence');

var spider = require('mrspider')({
    baseUrl: 'http://www.habitaclia.com'
});


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
