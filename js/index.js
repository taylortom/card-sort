$(function() {
  var data;

  init();

  function init() {
    initListeners();
    hideScreenlock(0);
  }

  function initListeners() {
    $("#newGroup").click(addNewGroup);
    $(".button.add").click(addNewCard);
    $(".button.save").click(toggleSaveDialog);
    $(".button.open").click(toggleStatesDialog);
  }

  function showScreenlock(duration) {
    $("#screenlock").fadeIn(duration);
  }

  function hideScreenlock(duration) {
    $("#screenlock").fadeOut(duration);
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
      showScreenlock();
    } else {
      hideScreenlock();
    }
    $el.css(isVisible ? visibleCSS : hiddenCSS).animate(isVisible ? hiddenCSS : visibleCSS, ANIM_TIME, function() {
      if(isVisible) $el.addClass("display-none");
    });

    return !isVisible;
  }

  function getSavedStates() {
    var data = JSON.parse(window.localStorage.getItem("states")) || [];
    return data || [];
  }

  function getSavedStateById(id) {
    var states = getSavedStates();
    var state;
    for(var i = 0, count = states.length; i < count; i++) {
      if(states[i].id.toString() === id) state = states[i];
    }
    return state;
  }

  function getCurrentState() {
    var state = {
      id: Date.now(),
      name: $('input[name="name"]').val(),
      stack: [],
      groups: [],
    };
    $("#stack div.card").each(function(index, card) {
      state.stack.push({ text: $(card).text() });
    });
    $("#groups .group").each(function(index, group) {
      var $group = $(group);
      var groupData = {
        name: $('.title', group).text(),
        cards: []
      };
      $('.card', group).each(function(index, card) {
        groupData.cards.push({ text: $(card).text() });
      });
      state.groups.push(groupData);
    });
    return state;
  };

  function toggleSaveDialog() {
    var $el = $(".popup.name");
    var $input = $('input', $el);
    var isVisible = toggleVisibility($el);
    if(!isVisible) {
      return;
    }
    $input.val("").focus();

    $(document).on("keydown", function(event) {
      if(event.which === 27) { // esc
        $(document).off("keydown");
        toggleSaveDialog();
        return;
      }
      if(event.which === 13) { // enter
        if($input.val().trim().length === 0) {
          var beforeCSS = { 'border-color': 'white' };
          var afterCSS = { 'border-color': 'red' };
          var DURATION = 200;
          $input.closest(".popup").css(beforeCSS).animate(afterCSS, DURATION, function() {
            $(this).animate(beforeCSS, DURATION);
          });
          return;
        }
        $(document).off("keydown");
        toggleSaveDialog();
        saveState();
      }
    });
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
      if(states.length === 0) {
        $(".states", $el).append('<p style="text-align:center;">No states saved!</p>');
      } else {
        for(var i = 0, count = states.length; i < count; i++) {
          $(".states", $el).append('<a href="#" class="button state" data-id="' + states[i].id + '">' + states[i].name);
        }
        $(".button.state").click(restoreState);
      }
    }
    toggleVisibility($el);
  }

  function restoreState(event) {
    $(".popup.states").addClass("display-none");
    hideScreenlock();
    data = getSavedStateById($(event.currentTarget).attr("data-id"));
    render();
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
