import Card from './Card.js';
import Group from './Group.js';
import { Keys } from './util/constants.js';

class CardSort {
  constructor({ state }) {
    this.state = state;
    this.init();
  }

  init() {
    this.initListeners();
    this.render();
  
    $("#year").text(new Date().getFullYear());
  }
  
  initListeners() {
    $("#newGroup").click(this.addNewGroup.bind(this));
    $(".button.add").click(this.addNewCard.bind(this));
    $(".button.save").click(this.showSaveDialog.bind(this));
    $(".button.open").click(this.showStatesDialog.bind(this));
    $(".button.reset").click(this.resetState.bind(this));
    $(".popup.name .button.close").click(this.hideSaveDialog.bind(this));
    $(".popup.states .button.close").click(this.hideStatesDialog.bind(this));
  
    $(document).on("keydown", event => {
      if(event.which === Keys.ESC) {
        this.hidePopups();
        this.showScreenlock(false);
        this.resetAddNewCard();
      }
    });
  }

  render() {
    $(".button.save").toggle(!this.state.readOnly);
    $(".button.open").toggle(!this.state.readOnly);
    $(".button.reset").toggle(!this.state.readOnly);
    $(".button.sync").toggle(this.state.readOnly);

    this.showScreenlock(false, 0);
    this.renderStateName();
    this.renderStack();
    this.renderGroups();
  }
  
  renderStateName() {
    const name = this.state.get().name;
    const $el = $("#name");
    name ? $el.text(name).show() : $el.hide();
  }
  
  renderStack() {
    $("#stack div.card").remove();
    const stack = this.state.get().stack || [];
    stack.forEach(s => $("#stack").append(new Card(s).$el));
  }
  
  renderGroups() {
    $("#groups").empty();
    const groups = this.state.get().groups || [];
    groups.forEach(g => this.renderGroup(g));
  }
  
  renderGroup(data) {
    $("#groups").append(new Group(data).$el);
  }
  
  showScreenlock(visible = true, duration) {
    visible ?
      $("#screenlock").fadeIn(duration) :
      $("#screenlock").fadeOut(duration);
  }
  
  showPopup($el, visible = true) {
    if(!visible) {
      return this.animatePopup($el, false);
    }
    if(!$el.hasClass('display-none')) {
      return;
    }
    this.hidePopups();
    this.animatePopup($el, true);
  }
  
  hidePopups() {
    $('.popup').addClass('display-none');
  }
  
  animatePopup($el, visible) {
    const ANIM_TIME = 100;
    // TODO get the top values dynamically
    const visibleCSS = { opacity: 1, top: 55 };
    const hiddenCSS = { opacity: 0, top: 35 };

    if(visible) $el.removeClass("display-none");
    this.showScreenlock(visible);

    $el
      .css(visible ? hiddenCSS : visibleCSS)
      .animate(visible ? visibleCSS : hiddenCSS, ANIM_TIME, () => !visible && $el.addClass("display-none"));
  
    return !visible;
  }
  
  showSaveDialog() {
    const $el = $(".popup.name");
    const $input = $('input', $el);
    this.showPopup($el);
  
    $input.val(this.state.get().name || "").focus();
    $input.on("keyup", event => event.which === 13 && this.saveState());
  }
  
  hideSaveDialog() {
    this.showPopup($(".popup.name"), false);
  }
  
  showStatesDialog() {
    const $el = $(".popup.states");
    const states = this.state.getSaved();
    $(".states", $el).empty();
    if(states.length === 0) {
      $(".states", $el).append('<p style="text-align:center;">No states saved!</p>');
    } else {
      states.forEach(s => {
        $(".states", $el).append(`<a href="#" class="button state" data-id="${s.id}">${s.name}`);
      });
      $(".button.state").click(this.restoreState.bind(this));
    }
    this.showPopup($el);
  }
  
  hideStatesDialog() {
    this.showPopup($(".popup.states"), false);
  }
  
  resetAddNewCard() {
    const $el = $(".card.button.add");
    $("span", $el).removeClass("display-none");
    $("span.input", $el).addClass("display-none");
    $("textarea", $el).val("");
  }
  
  addNewCard(clickEvent) {
    $(clickEvent.currentTarget).children().toggleClass("display-none");
    $("textarea", clickEvent.currentTarget)
      .focus()
      .on("keyup", keyEvent => {
        const text = $(keyEvent.target).val().trim();
        if(keyEvent.which === Keys.ESC && text !== "") {
          const card = new Card({ text: text });
          $("#stack .button.add").after(card.$el);
          this.resetAddNewCard();
        }
      });
  }
  
  addNewGroup(clickEvent) {
    if(clickEvent) {
      clickEvent.preventDefault() && clickEvent.stopPropagation();
      const originalEvent = clickEvent.originalEvent;
      if(originalEvent && $(originalEvent.target).is("input")) {
        return;
      }
    }
    $("span", clickEvent.currentTarget).toggleClass("display-none");
    $("input", clickEvent.currentTarget)
      .focus()
      .on("keyup", keyEvent => {
        const text = $(keyEvent.target).val().trim();
        if(keyEvent.which === Keys.ESC && text !== "") {
          this.renderGroup({ name: text, cards: [] });
          $("span", clickEvent.currentTarget).toggleClass("display-none");
          $("input", clickEvent.currentTarget).val("");
        }
      });
  }

  saveState() {
    const $input = $('.popup.name input');
    if($input.val().trim().length === 0) {
      const beforeCSS = { 'border-color': 'white' };
      const afterCSS = { 'border-color': 'red' };
      const DURATION = 200;
      $input.closest(".popup").css(beforeCSS).animate(afterCSS, DURATION, () => $(this).animate(beforeCSS, DURATION));
      return;
    }
    $(document).off("keydown");
    this.hideSaveDialog();
    this.state.update();
    this.state.save();
  }

  restoreState(event) {
    $(".popup.states").addClass("display-none");
    this.showScreenlock(false);
    this.state.restore($(event.currentTarget).attr("data-id"));
    this.render();
  }
  
  resetState(event) {
    this.hidePopups();
    this.state.reset();;
    this.render();
  }
}

export default CardSort;