$(function() {
  var data = {
    cards: null
  };

  init();

  function init() {
    loadData(render);
    initListeners();
  }

  function initListeners() {
    $("#newGroup").click(addNewGroup);
  }

  function loadData(doneCb) {
    $.getJSON("cards.json", function(responseData, status) {
      data.cards = responseData;
      return doneCb();
    }).fail(function(response) {
      alert("Couldn't load card data, server responded with: " + response.status + " - " + response.statusText);
    });
  }

  function render() {
    for(var i = 0, count = data.cards.length; i < count; i++) {
      var card = new Card(data.cards[i]);
      $("#cards #stack").append(card.$el);
    }
  }

  function addNewGroup(clickEvent) {
    if(clickEvent) {
      event.preventDefault() && clickEvent.stopPropagation();
      var originalEvent = clickEvent.originalEvent;
      if(originalEvent && $(originalEvent.target).is("input")) {
        return;
      }
    }
    $("span", clickEvent.currentTarget).toggleClass("display-none");
    $("input", clickEvent.currentTarget)
      .focus()
      .on('keyup', function(keyEvent) {
        var text = $(keyEvent.target).val();
        if(keyEvent.which === 13 && text !== '') {
          var group = new Group({ name: text, cards: []});
          $("#groups").append(group.$el);

          $("span", clickEvent.currentTarget).toggleClass("display-none");
          $("input", clickEvent.currentTarget).val("");
        }
      });
  }
});
