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
spider.use(mrspiderCssLinks('.paginacionlista a:last-child, h3 a'));
spider.use(mrspiderCssData({
    title: 'title',
    price: '#opciones-top li.precio',
    detail: 'div[itemprop=description]'
}));
spider.use(mrspiderCssImage({
    images: 'img[itemprop=image]'
}));

spider.use(regexDataExtractor({
    lat: /Lat: parseFloat\((\d+\.\d+)/,
    lng: /Lon: parseFloat\((\d+\.\d+)/
}));

spider.use(function (page, spider, next) {
    console.log(page.url);
    console.log(page.data);
    next();
});

spider.addUrl('http://www.habitaclia.com/alquiler-aparcamientos-barcelona.htm');
spider.crawl();

process.on('exit', function () {
    //console.log(spider.urls);
});
