class State {
  constructor() {
    this.data = {};
  }
  
  get() {
    return this.data;
  }

  update() {
    const state = {
      id: this.data.id || Date.now(),
      name: $('input[name="name"]').val(),
      stack: [],
      groups: [],
    };
    $("#stack div.card").each((index, card) => {
      state.stack.push({ text: $(card).text() });
    });
    $("#groups .group").each((index, group) => {
      const groupData = {
        name: $('.title', group).text(),
        cards: []
      };
      $('.card', group).each((index, card) => {
        groupData.cards.push({ text: $(card).text() });
      });
      state.groups.push(groupData);
    });
    this.data = state;
  };

  restore(id) {
    this.data = this.getSaved(id);
  }
  
  reset() {
    this.data = {};
  }

  save() {} // should be implemented in sub-class
  getSaved(id) {} // should be implemented in sub-class
}

export default State;