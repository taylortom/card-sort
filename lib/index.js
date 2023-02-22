async function importFiles(files) {
  return (await Promise.all(files.map(f => import(f)))).map(m => m.default);
}

$(function() {
  importFiles([
    './CardSort.js', 
    './states/LocalState.js'
  ]).then(([CardSort, LocalState]) => {
    new CardSort({ state: new LocalState() });
  });
});

/**
 * Initialise drag and drop interactions
 */

interact('.draggable')
  .draggable({
  // call this function on every dragmove event
  onmove: function dragMoveListener(event) {
    var target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    // translate the element
    target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;
    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  },
  // call this function on every dragend event
  onend: function dragEndListener(event) {
    $(document).off('mousemove');
    $(event.target)
      .css('transform', 'none')
      .attr({
        'data-x': 0,
        'data-y': 0
      });
  }
});

interact('.dropzone')
  .dropzone({
    overlap: 0.5,
    ondragenter: function (event) {
      $(event.target).addClass('drop-active');
    },
    ondragleave: function (event) {
      $(event.target).removeClass('drop-active');
    },
    ondrop: function(event) {
      event.relatedTarget.setAttribute('wasDragged', true);
      $(event.relatedTarget).appendTo(event.target);
      $(event.target).removeClass('drop-active');
    }
});
