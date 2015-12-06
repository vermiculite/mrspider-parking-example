"use strict";

var mrspiderRequest = require('mrspider-request');
var mrspiderCheerio = require('mrspider-cheerio');
var mrspiderCssLinks = require('mrspider-css-links');
var spider = require('mrspider')();
const LINKS_RULE = '.pagination-next a';

spider.use(mrspiderRequest);
spider.use(mrspiderCheerio);
spider.use(mrspiderCssLinks(LINKS_RULE));
spider.use(function(page, spider, next) {
    console.log(page.url);
    next();
});
spider.addUrl('http://www.fotocasa.es/alquiler/garajes/barcelona-provincia/listado-por-foto/');
spider.start();
//

