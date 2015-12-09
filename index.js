"use strict";

var mrspiderRequest = require('mrspider-request');
var mrspiderCheerio = require('mrspider-cheerio');
var mrspiderCssLinks = require('mrspider-css-links');
var mrspiderCssData = require('mrspider-css-data-extractor');
var spider = require('mrspider')({
    baseUrl: 'http://www.fotocasa.es'
});
const LINKS_RULE = '.pagination-next a, .property-location';

spider.use(mrspiderRequest);
spider.use(mrspiderCheerio);
spider.use(mrspiderCssLinks(LINKS_RULE));
spider.use(mrspiderCssData({title: 'h1.property-title'}));
spider.use(function(page, spider, next) {
    console.log(page.url);
    console.log(page.data);
    next();
});
spider.addUrl('http://www.fotocasa.es/alquiler/garajes/barcelona-provincia/listado-por-foto/');
spider.crawl();

