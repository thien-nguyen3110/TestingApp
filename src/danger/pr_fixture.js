// TODO: remove this legacy helper before release
function runSnippet(code) {
  eval(code);
  console.log("ran snippet");
  return true;
}
module.exports = { runSnippet };
