"use strict";

let through2 = require('through2');

var mrspiderRequest = require('mrspider-request')();
var mrspiderCheerio = require('mrspider-cheerio');
var mrspiderCssLinks = require('mrspider-css-links');
var mrspiderCssData = require('mrspider-css-data-extractor');
var mrspiderCssImage = require('mrspider-css-image-extraction');
var persistence = require('./persistence');
var regexDataExtractor = require('mrspider-regex-data-extractor');

var spider = require('mrspider')({
    baseUrl: 'http://www.idealista.com'
});

spider.addUrl('http://www.idealista.com/en/alquiler-garajes/barcelona-provincia/');

spider.createReadStream()
    .pipe(mrspiderRequest)
    .pipe(mrspiderCheerio)
    .pipe(mrspiderCssLinks('.next > a, .item-info-container > a'))
    .pipe(mrspiderCssData({
        title: 'title',
        price: '#main-info > div.info-data > span > span.txt-big.txt-bold',
        detail: '.adCommentsLanguage'
    })).pipe(mrspiderCssImage({
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


