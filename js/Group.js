import Card from './Card.js';

const Keys = {
  ENTER: 13,
  ESC: 27
}
class Group {
  constructor(data) {
    this.data = data;
    this.$el = $("<div>", { class: "group" });
    this.isEditing = false;
    this.render();
  }

  render() {
    var inputDiv = `<input type='text' name='groupTitle' value="${this.data.name}"class='display-none'>`;
    var textDiv = `<span>${this.data.name}</span>`;
    this.$el.append(`<div class='title'>${inputDiv}${textDiv}`, '<div class="cards dropzone">');
  
    $('.title', this.$el).click(this.onTitleClick.bind(this));
  
    this.renderCards();
  }
  
  renderCards() {
    for(var i = 0, count = this.data.cards.length; i < count; i++) {
      this.renderCard(this.data.cards[i]);
    }
  }
  
  renderCard(cardData) {
    var card = new Card(cardData);
    $('.cards', this.$el).append(card.$el);
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;

    const $span = $('.title > span', this.$el);
    const $input = $('.title > input', this.$el);

    $span.toggleClass('display-none', this.isEditing);
    $input.toggleClass('display-none', !this.isEditing);

    $input.off('keyup');
    
    if(this.isEditing) {
      $input.focus();
      $input.on("keyup", keyEvent => {
        const isEnter = keyEvent.which === Keys.ENTER;
        const isEsc = keyEvent.which === Keys.ESC;
        if(isEnter) $span.text($input.val());
        if(isEnter || isEsc) this.toggleEditing();
      });
    }
  }
  
  onTitleClick() {
    if(!this.isEditing) this.toggleEditing();
  }
};

export default Group;