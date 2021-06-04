module.exports = function (sequelize, Sequelize) {

  var User = sequelize.define('User', {

    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    firstName: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    lastName: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    username: {
      type: Sequelize.TEXT
    },



    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      }
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    genHash: {
      type: Sequelize.STRING,
      allowNull: false
    },

  });

  return User;

}