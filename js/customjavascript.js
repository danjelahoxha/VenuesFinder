var venueFinder = {
  init: function (settings) {
    venueFinder.config = {
      clientId: 'OEFQ3GKBJWXWPLXPKWBXIXUGBIY1PYJ5Z21XXC0N3MHRDKCD',
      clientSecret: '0RKUNX2UJE2V2LIPMTUZIOFF5UXS2TYQALLAR54YMVLH2WZW'
    };
    $.extend(venueFinder.config, settings);
    venueFinder.getCategories();
     
    $(document).on('change', '.userLocation, .venuecategories', function () {
      venueFinder.getVenues();
      venueFinder.getVenueDetails();
    });
  },
   //gets the list of venues on Search 
  getVenues() {
    $('.card-venues').show();
    var searchValue = $(".userLocation").val();
    var categoryid = $(".venuecategories").val();
    var _url = venueFinder.buildUrl(searchValue, categoryid);
    $('ul.venues').empty();
    venueFinder.getData(_url, function (data) {
      venueFinder.buildVenuesList(data.response.venues);
    }, function (xhr, error) {
      $('.venues').append('<li class="list-group-item" >Sorry, We could not find any venues</li>');
    }
    );

  },
  //builds items of the  list 
  buildVenuesList: function (venues) {
    $.each(venues, function (i, venue) {
      $('.venues').append('<li class="list-group-item venue-item" '
        + 'data-venueId="' + venue.id + '">'
        + venue.name
        + '<br /><small> ' + venue.location.formattedAddress.join(", ")
        + '</li>');
    });
    venueFinder.getVenueDetails();
  },
// gets specific data of a venue and opens the modal , any additional data in modal can be added here
  getVenueDetails: function () {
    $(".venue-item").off("click").on("click", function () {
      var id = $(this).attr("data-venueId");
      var venueUrl = "https://api.foursquare.com/v2/venues/" + id
        + '?client_id=' + venueFinder.config.clientId
        + '&client_secret=' + venueFinder.config.clientSecret
        + '&query=&v=20181220&m=foursquare';
      venueFinder.getData(venueUrl, function (data) {
        $(".modal-title").html(data.response.venue.name);
        console.log(data.response.venue)
        $(".modal-body").empty();

        $(".modal-body").append(data.response.venue.description);
        if (data.response.venue.categories.length > 0)
          $(".modal-body").append("<br /><strong>Categories: </strong>" +
            $.map(data.response.venue.categories, function (obj) {
              return obj.name
            }).join(', ')
          );

        $(".modal-body").append("<br /> <strong>Location: </strong>" + data.response.venue.location.formattedAddress.join(','));
        if (typeof data.response.venue.bestPhoto != 'undefined'){
          $(".modal-body").append("<br /> <img src='" + data.response.venue.bestPhoto.prefix + "300x300" + data.response.venue.bestPhoto.suffix + "' />");
        }else{
          $(".modal-body").append("<br /> <i>No photo Available </i>");
        }
        $(".modal").modal("show");
      })
    })
  },
  //get main categories from foursquare api to fill the dropdown select
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
  //get search parameters to build url
  buildUrl: function (searchValue, categoryId) {
    var _url = '';
    if (searchValue != '') {
      _url = 'https://api.foursquare.com/v2/venues/search?'
        + '&near=' + searchValue
        + '&client_id=' + venueFinder.config.clientId
        + '&client_secret=' + venueFinder.config.clientSecret
        + '&categoryId=' + categoryId
        + '&query=&v=20181220&m=foursquare';
    }  
    return _url;
  },
  //ajax call function
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