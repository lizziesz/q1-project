$(document).ready(function() {
  var favorites = [];
  getFromLocalStorage();


  //toggle the additional options search bar
  $('#hiddenOptions').hide();
  $('#moreResultsButton').hide();
  $('#addOptions').on('click', 'button', function() {
      $('#hiddenOptions').slideToggle();
  });

  //load search results
  var text = $('#searchText').val();
  $('#searchButton').on('click', function(e) {
    e.preventDefault();
    var text = $('#searchText').val();
    //set additional search parameters
    var reqIng = $('#required-ingredients input:checked');
    var reqIngUrl = '';
    if(reqIng) {
      reqIng.each(function(recipe) {
        reqIngUrl += '&allowedIngredient[]=' + reqIng[recipe].name;
      });
    }
    var avoidIng = $('#must-avoid input:checked');
    var avoidIngUrl = '';
    if(avoidIng) {
      avoidIng.each(function(recipe) {
        avoidIngUrl += '&allowedAllergy[]=' + avoidIng[recipe].id + '^' + avoidIng[recipe].name;
      });
    }
    var holidays = $('#holidays input:checked');
    var holidaysUrl = '';
    if(holidays) {
      holidays.each(function(recipe) {
        holidaysUrl += '&allowedHoliday[]=holiday^holiday-' + holidays[recipe].name;
      });
      console.log(holidaysUrl);
    }


    //searching action
    if (text) {
      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }
      var startVal = getRandomInt(1, 100);
      //
      $('#error').html('');
      $('#results').html('');
      $('#moreResultsList').html('');
      $('#yummly').html('');
      $.ajax({
        url: 'http://api.yummly.com/v1/api/recipes?_app_id=340d1d95&_app_key=7e0092d58dd4c8cac6f79cde2a9e786f&q=' + text + '&requirePictures=true&allowedCourse[]=course^course-Desserts' + reqIngUrl + avoidIngUrl + holidaysUrl,
        method: 'GET',
        dataType: 'jsonp',
        success: function(data) {
          $('#moreResultsButton').show();
          $('#yummly').append(data.attribution.html);
          data.matches.forEach(function(recipe) {
            $.ajax({
              url: 'http://api.yummly.com/v1/api/recipe/' + recipe.id + '?_app_id=340d1d95&_app_key=7e0092d58dd4c8cac6f79cde2a9e786f',
              method: 'GET',
              dataType: 'jsonp'
            }).success(function(data) {
                recipeLi = $('<li style="height: 100%"><a href="' + data.source.sourceRecipeUrl + '" target="_blank" id="url"><div id="name"> <strong>' + data.name + '</strong></div></a><div><img src="' + data.images[0].hostedMediumUrl + '"></div><div><button type="button" class="btn btn-warning btn-small star"><span class="glyphicon glyphicon-star" aria-hidden="true"></span></button></div><div id="rating"> Yummly Rating: ' + data.rating + '</div><div id="time"> Total Time: ' + data.totalTime + '</div></li>');
                $('#results').append(recipeLi);

              }).error(function(data) {
                $('#results').append("Sorry, something went wrong...");
                console.log("Sorry");
              });

            });

            $('#moreResultsButton').on('click', 'button', function(e) {
              e.preventDefault();
              var newText = $('#searchText').val();
              var reqIng2 = $('#required-ingredients input:checked');
              var reqIngUrl2 = '';
              if(reqIng2) {
                reqIng2.each(function(recipe) {
                  reqIngUrl2 += '&allowedIngredient[]=' + reqIng2[recipe].name;
                });
              }
              var avoidIng2 = $('#must-avoid input:checked');
              var avoidIngUrl2 = '';
              if(avoidIng2) {
                avoidIng2.each(function(recipe) {
                  avoidIngUrl2 += '&allowedAllergy[]=' + avoidIng2[recipe].id + '^' + avoidIng2[recipe].name;
                });
              }
              var holidays2 = $('#holidays input:checked');
              var holidaysUrl2 = '';
              if(holidays2) {
                holidays2.each(function(recipe) {
                  holidaysUrl2 += '&allowedHoliday[]=holiday^holiday-' + holidays2[recipe].name;
                });
              }
              var newStartVal = getRandomInt(11, 100);

              $.ajax({
                url: 'http://api.yummly.com/v1/api/recipes?_app_id=340d1d95&_app_key=7e0092d58dd4c8cac6f79cde2a9e786f&q=' + newText + '&requirePictures=true&allowedCourse[]=course^course-Desserts' + reqIngUrl2 + avoidIngUrl2 + holidaysUrl2 + '&start=' + newStartVal,
                method: 'GET',
                dataType: 'jsonp',
                success: function(data) {

                  data.matches.forEach(function(recipe) {
                    $.ajax({
                      url: 'http://api.yummly.com/v1/api/recipe/' + recipe.id + '?_app_id=340d1d95&_app_key=7e0092d58dd4c8cac6f79cde2a9e786f',
                      method: 'GET',
                      dataType: 'jsonp',
                      success: function(data) {
                        recipeLi = $('<li style="height: 100%"><a href="' + data.source.sourceRecipeUrl + '" target="_blank" id="url"><div id="name"> <strong>' + data.name + '</strong></div></a><div><img src="' + data.images[0].hostedMediumUrl + '"></div><div><button type="button" class="btn btn-warning btn-small star"><span class="glyphicon glyphicon-star" aria-hidden="true"></span></button></div><div id="rating"> Yummly Rating: ' + data.rating + '</div><div id="time"> Total Time: ' + data.totalTime + '</div></li>');
                        $('#moreResultsList').append(recipeLi);
                      }
                  });
                });
              }
            });
        });
      }
    });
  }


    //don't let people search nothing
    else if (!text) {
      $('#error').html("Please enter something to search!");
    }

  });

  function addToLocalStorage(favorites) {
    var tempObj = {};
    for (var i = 0; i < favorites.length; i++) {
      tempObj[i] = favorites[i]
    };

    favoritesData = JSON.stringify(tempObj);

    window.localStorage.favorites = favoritesData;

  }

  function getFromLocalStorage() {
    if(window.localStorage.favorites) {
    favoritesData2 = JSON.parse(window.localStorage.favorites);

    for(var key in favoritesData2) {
      favorites.push(favoritesData2[key]);
      $('#favoriteResults').append(favoritesData2[key]);
    }
    }
  }

  function removeFromLocalStorage() {
    localStorage.removeItem();
  }

    $(document).on('click', '.star', function(e) {
    e.preventDefault();
    var shortLi = '<div class="fave">' + '<button type="button" class="btn btn-danger btn-small remove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button><div id="faveContent">' + $(this).parent().parent().children()[0].outerHTML + $(this).parent().parent().children()[1].innerHTML + '</div></div>';
    $('#favoriteResults').append(shortLi);
    favorites.push(shortLi);
    addToLocalStorage(favorites);

  });

  $(document).on('click', '.remove', function(e) {
    e.preventDefault();
    $(this).parent().remove();
    var json = JSON.parse(window.localStorage.favorites);
    for(var key in json) {
      if(json[key] === $(this).parent()[0].outerHTML) {
        delete json[key];
      }
    }
    window.localStorage.favorites = JSON.stringify(json);
  });

});
