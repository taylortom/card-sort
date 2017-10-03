$(function() {
  var data;

  init();

  function init() {
    initListeners();
  }

  function initListeners() {
    $("#newGroup").click(addNewGroup);
    $(".button.add").click(addNewCard);
    $(".button.save").click(toggleSaveDialog);
    $(".button.open").click(toggleStatesDialog);
    $("")
  }

  function toggleVisibility($el) {
    var ANIM_TIME = 100;
    // TODO get the top values dynamically
    var visibleCSS = {
      opacity: 1,
      top: 55
    };
    var hiddenCSS = {
      opacity: 0,
      top: 35
    };
    var isVisible = !$el.hasClass('display-none');

    if(!isVisible) {
      $el.removeClass("display-none");
    }
    $el.css(isVisible ? visibleCSS : hiddenCSS).animate(isVisible ? hiddenCSS : visibleCSS, ANIM_TIME, function() {
      if(isVisible) $el.addClass("display-none");
    });
  }

  function getSavedStates() {
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

  function toggleSaveDialog() {
    var $el = $(".popup.name");
    toggleVisibility($el);
    if(!$el.hasClass('display-none')) {
      $('input', $el).focus();
    }
  }

  function saveState() {
    var states = getSavedStates();
    states.push(getCurrentState());
    window.localStorage.setItem("states", JSON.stringify(states));
  }

  function toggleStatesDialog() {
    var $el = $(".popup.states");
    if($el.hasClass("display-none")) {
      var states = getSavedStates();
      $(".states", $el).empty();
      for(var i = 0, count = states.length; i < count; i++) {
        $(".states", $el).append('<a href="#" class="button state" data-id="' + states[i].id + '">' + states[i].name);
    }
    $(".button.state").click(restoreState);
    toggleVisibility($el);
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
