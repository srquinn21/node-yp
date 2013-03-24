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
      results = {},
      self = this,
      params, callback;

  if(args.length < 2 || !Array.isArray(args[0])) {
    throw new Error('You must provide an array of terms and a callback for the search method.');
  }

  if(typeof args[1] === 'function') {
    params = {};
    callback = args[1];
  }
  else {
    params = args[1];
    callback = args[2];
  }

  async.forEach(args[0], function(term, done){

    var query = {
      key: self.key,
      term: term,
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

    request(self.url + 'search?' + qs.stringify(query), function(err, response, body){
      if(err) callback(err);
      results[term] = JSON.parse(body).searchResult.searchListings.searchListing;
      results['metadata'] = JSON.parse(body).searchResult.metaProperties;
      done();
    });

  }, function(err){
    callback(err, results);
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
    if(err) callback(err);
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
    if(err) callback(err);
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
    if(err) callback(err);
    callback(err, JSON.parse(body));
  });

}