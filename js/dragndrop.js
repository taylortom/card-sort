interact('.draggable')
  .draggable({
  // keep the element within the area of it's parent
  // enable autoScroll
  autoScroll: true,
  snap: {

  },
  // call this function on every dragmove event
  onmove: function dragMoveListener(event) {
    var target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  },
  // call this function on every dragend event
  onend: function dragEndListener(event) {
    console.log('moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
  }
});
