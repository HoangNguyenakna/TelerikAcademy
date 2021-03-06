// Generated by CoffeeScript 1.4.0
(function() {
  var scope, table;

  table = $('.js-table');

  scope = table.closest('.js-view').data('scope');

  scope.persister.scores().done(function(scores) {
    var html, scoreItemTemplate;
    scoreItemTemplate = $('#js-score-item-template').text();
    html = _.sortBy(scores, function(s) {
      return -s.score;
    }).map(function(score, i) {
      score.position = i + 1;
      return Mustache.render(scoreItemTemplate, score);
    }).join('');
    return table.append($('<tbody />').html(html));
  });

}).call(this);
