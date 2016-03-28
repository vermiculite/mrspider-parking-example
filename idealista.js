"use strict";

let through2 = require('through2');

var mr = require('mrspider');
let spider = mr.Spider({
    baseUrl: 'http://www.idealista.com'
});

let mrspiderRequest = mr.request();
let mrspiderCheerio = mr.cheerio;
let mrspiderJsdom = mr.jsdom();
let mrspiderCssLinks = mr.cssLinks;
let mrspiderCssData = mr.cssDataExtractor;
let mrspiderCssImage = mr.cssImageExtraction;
let persistence = require('./persistence');
let regexDataExtractor = mr.regexDataExtractor;

spider.addUrl('http://www.idealista.com/en/alquiler-garajes/barcelona-provincia/');

spider.createReadStream()
    .pipe(mrspiderRequest)
    .pipe(mrspiderCheerio)
    .pipe(mrspiderCssLinks('.next > a, .item-info-container > a'))
    .pipe(mrspiderCssData({
        title: 'title',
        price: '#main-info > div.info-data > span > span.txt-big.txt-bold',
        detail: '.adCommentsLanguage'
    }))
    .pipe(mrspiderCssImage({
        images: 'meta[name="og:image"]'
    }, 'content'))
    .pipe(regexDataExtractor({
        lat: /latitude:"(\d+\.\d+)/,
        lng: /longitude:"(\d+\.\d+)/
    }))
    .pipe(persistence())
    .pipe(through2.obj(function(page, enc, next) {
        console.log(page.url);
        console.log(page.data);
        next();
    }));


