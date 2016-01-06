"use strict";

var mrspiderRequest = require('mrspider-request');
var mrspiderJsdom = require('mrspider-jsdom')();
var mrspiderCssLinks = require('mrspider-css-links');
var mrspiderCssData = require('mrspider-css-data-extractor');
var mrspiderCssImage = require('mrspider-css-image-extraction');
var regexDataExtractor = require('mrspider-regex-data-extractor');
var persistence = require('./persistence');

var spider = require('mrspider')({
    baseUrl: 'http://www.habitaclia.com'
});

spider.use(mrspiderRequest);

spider.use(mrspiderJsdom);

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

persistence(spider);

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
