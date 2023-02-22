async function importFiles(files) {
  return (await Promise.all(files.map(f => import(f)))).map(m => m.default);
}

$(function() {
  importFiles([
    './CardSort.js', 
    './LocalState.js'
  ]).then(([CardSort, LocalState]) => {
    new CardSort({ state: new LocalState() });
  });
});
