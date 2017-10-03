$(function() {
  var data;

  init();

  function init() {
    initListeners();
  }

  function initListeners() {
    $("#newGroup").click(addNewGroup);
    $(".button.add").click(addNewCard);
    $(".button.save").click(saveState);
    $(".button.open").click(showStates);
  }

  function getStates() {
    var data = JSON.parse(window.localStorage.getItem("states")) || [];
    return data || [];
  }

  function getCurrentState() {
    var state = {
      name: "",
      stack: [],
      groups: [],
    };
    /*
    get name input
    get stack {
      text: "text"
    }
    get groups: {
      name: "text",
      cards: [
        { text: "text" }
      ]
    }
    */
    return state;
  };

  function saveState() {
    var states = getStates();
    states.push(getCurrentState());
    window.localStorage.setItem("states", JSON.stringify(states));
  }

  function showStates() {
    var states = getStates();
    var $el = $(".popup-states");
    $('.states', $el).empty();
    for(var i = 0, count = states.length; i < count; i++) {
      $(".states", $el).append('<a href="#" class="button state" data-id="' + states[i].id + '">' + states[i].name);
    }
    $el.removeClass("display-none");

    $(".button.state").click(restoreState);
  }

  function restoreState(event) {
    console.log($(event.currentTarget).attr('data-id'));
    // data = state;
    // render();
  }

  function render() {
    renderStack();
    renderGroups();
  }

  function renderStack() {
    if(!data.stack) return;
    for(var i = 0, count = data.stack.length; i < count; i++) {
      var card = new Card(data.stack[i]);
      $("#stack").append(card.$el);
    }
  }

  function renderGroups() {
    if(!data.groups) return;
    for(var i = 0, count = data.groups.length; i < count; i++) {
      renderGroup(data.groups[i]);
    }
  }

  function renderGroup(data) {
    var group = new Group(data);
    $("#groups").append(group.$el);
  }

  function addNewCard(clickEvent) {
    $(clickEvent.currentTarget).children().toggleClass("display-none");
    $("textarea", clickEvent.currentTarget)
      .focus()
      .on("keyup", function(keyEvent) {
        var text = $(keyEvent.target).val().trim();
        if(keyEvent.which === 13 && text !== "") {
          var card = new Card({ text: text });
          $("#stack .button.add").after(card.$el);

          $("span", clickEvent.currentTarget).toggleClass("display-none");
          $("textarea", clickEvent.currentTarget).val("");
        }
      });
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
      .on("keyup", function(keyEvent) {
        var text = $(keyEvent.target).val().trim();
        if(keyEvent.which === 13 && text !== "") {
          renderGroup({ name: text, cards: [] });
          $("span", clickEvent.currentTarget).toggleClass("display-none");
          $("input", clickEvent.currentTarget).val("");
        }
      });
  }
});
