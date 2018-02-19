let utility = {};

utility.toS = (data) => JSON.stringify(data);
utility.getRandomNumBetween = (min, max) => function(){return Math.floor(Math.random() * max) + min};

module.exports = utility;
