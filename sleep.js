async function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

function randomSleep() {
  return sleep(500 + Math.round(Math.random() * 500));
}

module.exports = {
  randomSleep,
};
