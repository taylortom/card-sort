import State from './State.js';

class LocalState extends State {
  getSaved(id) {
    const states = JSON.parse(window.localStorage.getItem("states")) || [];
    return id ? states.find(s => s.id.toString() === id) : states;
  }

  save() {
    const current = this.get();
    const states = this.getSaved();
    const i = states.findIndex(s => s.name === current.name);
    // update or add
    i > -1 ? states[i] = current : states.push(current);
    window.localStorage.setItem("states", JSON.stringify(states));
  }
}

export default LocalState;