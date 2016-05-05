$(document).ready(function() {
  //toggle the additional options search bar
  $('#hiddenOptions').hide();
  $('#addOptions').on('click', 'button', function() {
      $('#hiddenOptions').slideToggle();
  });

  //load search results
  var text = $('#searchText').val();
  $('#searchButton').on('click', function(e) {
    e.preventDefault();
    var text = $('#searchText').val();
    if(text) {
      $('#error').html('');
      $.ajax({
        url: 'http://api.yummly.com/v1/api/recipes?_app_id=340d1d95&_app_key=7e0092d58dd4c8cac6f79cde2a9e786f&q=' + text + '&requirePictures=true&allowedCourse[]=course^course-Desserts',
        method: 'GET',
        dataType: 'jsonp',
        success: function(data) {
          $('footer').append(data.attribution.html);
          data.matches.forEach(function(recipe) {
            $.ajax({
              url: 'http://api.yummly.com/v1/api/recipe/' + recipe.id + '?_app_id=340d1d95&_app_key=7e0092d58dd4c8cac6f79cde2a9e786f',
              method: 'GET',
              dataType: 'jsonp',
              success: function(data) {
                var recipeLi = $('<li style="height: 100%><a href="' + data.source.sourceRecipeUrl + '"><div> <strong>' + data.name + '    </strong><button class="glyphicon glyphicon-star" aria-hidden="true"></button></div></a><div><img src="' + data.images[0].hostedMediumUrl + '"></div><div> Yummly Rating: ' + data.rating + '</div><div> Yield: ' + data.yield + '</div><div> Total Time: ' + data.totalTime + '</div></li>');
                $('#results').append(recipeLi);
              }
            });
          });
        }
      });
    }
    if(!text) {
      $('#error').html("Please enter something to search!");
    }
  });
});
