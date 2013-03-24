/*
 *  node-yp
 *  A wrapper around the Yellow Pages API with some added convenience.
 *  
 *  Copyright(c) 2013 JibSales <info@jibsales.com>
 *  MIT LICENSE
 */

var request = require('request'),
    async   = require('async'),
    qs      = require('querystring');

var YellowPages = module.exports = function(key) {
  if(!key) throw new Error('API key is required for using the Yellow Pages API.');
  this.key = key;
  this.url = 'http://api2.yp.com/listings/v1/';
};

YellowPages.prototype.search = function () {

  var args = arguments,
      params, callback;

  if(typeof args[1] === 'function') {
    params = {};
    callback = args[1];
  }
  else {
    params = args[1];
    callback = args[2];
  }

  var query = {
    key: this.key,
    term: args[0],
    useragent: 'nodejs',
    searchloc: params.location || '',
    phonesearch: params.phonesearch || false,
    listingcount: params.listingcount || 5,
    shorturl: params.shorturl || false,
    format: 'json',
    pagenum: params.pagenum || 1,
    sort: params.sort || 'distance',
    radius: params.radius || 5
  }

  request(this.url + 'search?' + qs.stringify(query), function(err, response, body){
    callback(err, {
      listing: JSON.parse(body).searchResult.searchListings.searchListing,
      metadata: JSON.parse(body).searchResult.metaProperties
    });
  });

}

YellowPages.prototype.details = function (id, callback) {

  var query = {
    key: this.key,
    format: 'json',
    useragent: 'nodejs',
    listingid: id
  }

  request(this.url + 'details?' + qs.stringify(query), function(err, response, body){
    callback(err, {
      listingDetail: JSON.parse(body).listingsDetailsResult.listingsDetails.listingDetail,
      metadata: JSON.parse(body).listingsDetailsResult.metaProperties
    });
  });

}

YellowPages.prototype.reviews = function (id, callback) {

  var query = {
    key: this.key,
    format: 'json',
    useragent: 'nodejs',
    listingid: id
  }

  request(this.url + 'reviews?' + qs.stringify(query), function(err, response, body){
    callback(err, {
      reviews: JSON.parse(body).ratingsAndReviewsResult.reviews,
      metadata: JSON.parse(body).ratingsAndReviewsResult.metaProperties
    });
  });

}

YellowPages.prototype.listingmap = function () {

  var args = arguments,
      params, callback;

  if(typeof args[1] === 'function') {
    params = {};
    callback = args[1];
  }
  else {
    params = args[1];
    callback = args[2];
  }

  var query = {
    key: this.key,
    listingid: args[0],
    useragent: 'nodejs',
    
  }

  request(this.url + 'listingmap?' + qs.stringify(query), function(err, response, body){
    callback(err, JSON.parse(body));
  });

}