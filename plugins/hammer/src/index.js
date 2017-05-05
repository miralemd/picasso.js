import hammer from './hammer';

module.exports = function initialize(picasso) {
  picasso.interaction('hammer', hammer);
};
