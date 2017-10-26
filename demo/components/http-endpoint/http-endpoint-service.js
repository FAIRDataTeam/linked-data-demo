app.service('HttpEndpoint', function($q, $http, $timeout, GENERAL_CONFIG) {  
  var endpointBaseUrl = GENERAL_CONFIG.END_POINT_BASE_URL;
  var endpoint = endpointBaseUrl + 'namespace/test/sparql';

  var getResourceName = function (url) {
    var urlParser = document.createElement('a');
    urlParser.href = url;
    var urlLocalName = url.substring(url.lastIndexOf('/') + 1);
    var name = urlParser.hostname + urlParser.port + urlLocalName;
    name = name.replace(/\./g, "_");
    return name;
  };

  return {
    /**
     * params is expected in the following format:
     *  { 'param_name': 'uri'}
     */
    query: function (q, params) {
      if (params) {
	Object.keys(params).forEach(function (key) {
	  q = q.replace(key, params[key]);
	});
      }

      return $http.get(endpoint, {
	params: {
	  query: q,
	  format: 'json',
	  callback: 'JSON_CALLBACK'
	}
      });
    },
    load: function (resource, graphUri) {
      var deferred = $q.defer();
      var cacheLocation = endpoint;
      var contextUri = resource;
      if (graphUri) {
	contextUri = graphUri;
      }


      $http.post(cacheLocation, {
	headers: {
	  'Content-Type': 'application/x-www-form-urlencoded'
	},
	data: {
	  'uri': resource,
	  'context-uri': contextUri
	}
      }).then(function (res) {
	deferred.resolve(res);
	console.log('Caching : url ==>  ' + cacheLocation);
      }, function (res) {
	console.log('failed to PUT file in endpoint');
	deferred.reject(res);
      });
      return deferred.promise;
    }
  };
});