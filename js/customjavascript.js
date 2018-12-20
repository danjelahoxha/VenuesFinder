var venueFinder = {
  init: function (settings) {
    venueFinder.config = {
      clientId: 'OEFQ3GKBJWXWPLXPKWBXIXUGBIY1PYJ5Z21XXC0N3MHRDKCD',
      clientSecret: '0RKUNX2UJE2V2LIPMTUZIOFF5UXS2TYQALLAR54YMVLH2WZW'
    };
    $.extend(venueFinder.config, settings);
    venueFinder.getCategories();
    venueFinder.getGeoLocation();
    $(document).on('change', '.userLocation, .venuecategories', function () {
      venueFinder.getVenues();
    });

  },
  getGeoLocation() {
    $(".hover-map").on("click", function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          venueFinder.getVenues(position.coords.latitude, position.coords.longitude)
        });
      } else {
        $(".alert-danger").show();
        setTimeout(function () {
          $(".alert-danger").hide();
        }, 3000);
      }
    })
  },

  getVenues(lang, length) {
    $('.card-venues').show();
    var searchValue = $(".userLocation").val();
    var categoryid = $(".venuecategories").val();
    var _url = venueFinder.buildUrl(searchValue, categoryid, lang, length);
    $('ul.venues').empty();
    $.ajax({
      url: _url,
      dataType: 'json',
      success: function (data) {
        console.log(data.response);
        venueFinder.buildVenuesList(data.response.venues);
      },
      error: function (xhr, error) {
        $('.venues').append('<li class="list-group-item" >Sorry, We could not find any venues</li>');
      }
    });

  },
  buildVenuesList: function (venues) {
    $.each(venues, function (i, venue) {
    //  var imgurl = venue.categories[0].icon.prefix + venue.categories[0].icon.suffix;
      $('.venues').append('<li class="list-group-item" '
        + 'data-venuId="' + venue.location.id + '">'
      //  + '<img src ="' + imgurl + '" /> '
        + venue.name
        + '<br /><small> ' + venue.location.formattedAddress.join(", ")
        + '</li>');
    });
  },
  getCategories: function () {
    var _urlCategories = 'https://api.foursquare.com/v2/venues/categories?&client_id='
      + venueFinder.config.clientId
      + '&client_secret=' + venueFinder.config.clientSecret
      + '&query=&v=20181220&m=foursquare';
    venueFinder.getData(
      _urlCategories,
      function (data) {
        var categories = data.response.categories;
        $.each(categories, function (i, category) {
          $('.venuecategories').append('<option value="' + category.id + '">' + category.name + '</option>');
        });
      }, function () {
        return;
      });
  },
  buildUrl: function (searchValue, categoryId, lang, length) {
    var _url = '';
    if (searchValue != '') {
      _url = 'https://api.foursquare.com/v2/venues/search?'
        + '&near=' + searchValue
        + '&client_id=' + venueFinder.config.clientId
        + '&client_secret=' + venueFinder.config.clientSecret
        + '&categoryId=' + categoryId
        + '&query=&v=20181220&m=foursquare';
    } else if (typeof lang != 'undefined' && typeof length != 'undefined' && lang != '' && length != '') {
      _url = 'https://api.foursquare.com/v2/venues/search?'
        + '&ll=' + lang + ',' + length
        + '&client_id=' + venueFinder.config.clientId
        + '&client_secret=' + venueFinder.config.clientSecret
        + '&categoryId=' + categoryId
        + '&query=&v=20181220&m=foursquare';
    }
    return _url;
  },
  getData: function (_url, _success, _error) {
    $.ajax({
      url: _url,
      dataType: 'json',
      success: function (data) {
        _success(data);
      },
      fail: function () {
        if (typeof _error != 'undefined') {
          _error();
        }
      }
    })
  },
};

$(document).ready(function () {
  $(".userLocation").select();
  venueFinder.init();
  if ($('.card-venues li ').length < 1) {
    $('.card-venues').hide();
  }
  $('.card-venues').slimScroll({
    width: '100%',
    height: '400px',
  });




});