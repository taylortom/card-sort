class Card {
  constructor(data) {
    this.data = data;
    this.$el = $("<div/>", { class: "card draggable" }).text(data.text);
  }
}

export default Card;