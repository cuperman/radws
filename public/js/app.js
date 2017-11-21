function renderSummary(request, status, body) {
  function responseBody(body) {
    if (body) {
      return (
        '<h4>Response Body</h4>' +
        '<pre>' + JSON.stringify(body, null, 2) + '</pre>'
      );
    } else {
      return '';
    }
  }

  return (
    '<h4>Request: ' + request + '</h4>' +
    '<h4>Status: ' + status + '</h4>' +
    responseBody(body)
  );
}

function renderError(request, error) {
  return (
    '<h4>Request: ' + request + '</h4>' +
    '<h4>Error: ' + error + '</h4>'
  );
}

$(document).ready(function() {
  var $form = $('form');
  var $method = $form.find('[name="method"]');
  var $path = $form.find('[name="path"]');
  var $articleId = $form.find('[name="article-id"]');
  var $id = $form.find('[name="id"]');
  var $body = $form.find('[name="body"]');
  var $summary = $('#summary');

  var editor = ace.edit('editor');
  editor.setTheme('ace/theme/textmate');
  editor.setShowPrintMargin(false);
  editor.getSession().setMode('ace/mode/json');
  editor.getSession().on('change', function() {
    $body.val(editor.getValue());
  });

  $form.on('submit', function() {
    var method = $method.val();
    var url = $path
      .val()
      .replace(/:id/, $id.val())
      .replace(/:article_id/, $articleId.val());
    var data = JSON.parse(JSON.stringify($body.val()));

    $.ajax({
      method: method,
      url: url,
      data: data,
      dataType: 'json',
      contentType: 'application/json'
    })
      .done(function(data, textStatus) {
        $summary.html(renderSummary(url, textStatus, data));
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        $summary.html(renderError(url, errorThrown));
      });

    return false;
  });
});
