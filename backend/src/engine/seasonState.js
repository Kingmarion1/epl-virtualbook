let currentWeek = 1;

const getCurrentWeek = () => currentWeek;

const incrementWeek = () => {
  currentWeek++;
};

const resetWeek = () => {
  currentWeek = 1;
};

module.exports = {
  getCurrentWeek,
  incrementWeek,
  resetWeek
};
