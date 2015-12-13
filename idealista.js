"use strict";

var mrspiderRequest = require('mrspider-request');
var mrspiderCheerio = require('mrspider-cheerio');
var mrspiderCssLinks = require('mrspider-css-links');
var mrspiderCssData = require('mrspider-css-data-extractor');
var mrspiderCssImage = require('mrspider-css-image-extraction');
var regexDataExtractor = require('mrspider-regex-data-extractor');
var spider = require('mrspider')({
    baseUrl: 'http://www.idealista.com'
});
spider.use(mrspiderRequest);
spider.use(mrspiderCheerio);
spider.use(mrspiderCssLinks('.next > a, .item-info-container > a'));
spider.use(mrspiderCssData({
    title: 'title',
    price: '#main-info > div.info-data > span > span.txt-big.txt-bold',
    detail: '.adCommentsLanguage'
}));
spider.use(mrspiderCssImage({
    images: 'meta[name="og:image"]'
}, 'content'));

spider.use(function (page, spider, next) {
    console.log(page.url);
    console.log(page.data);
    next();
});

spider.addUrl('http://www.idealista.com/en/alquiler-garajes/barcelona-provincia/');
spider.crawl();

process.on('exit', function () {
    //console.log(spider.urls);
});
