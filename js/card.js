var Card = function(data) {
  this.data = data;
  this.$el = $("<div/>", { class: "card draggable" }).text(this.data.text);
};
