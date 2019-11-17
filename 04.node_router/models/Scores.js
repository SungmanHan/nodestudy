const path = require("path");
const {Sequelize, sequelize} = require(path.join(__dirname, "../modules/sequelize-conn"));

const Model = Sequelize.Model;
class Scores extends Model {}

Scores.init({
	stdname: {type: Sequelize.STRING, allowNull: false},
	kor: {type: Sequelize.TINYINT, allowNull: false},
	eng: {type: Sequelize.TINYINT, allowNull: false},
	mat: {type: Sequelize.TINYINT, allowNull: false}
}, {
	sequelize,
	modelName: "scores",
	timestamps:false
});
//Scores.sync({force: true}); 있는 것을 지우고 다시 만듬
Scores.sync({force: false});

module.exports = {Scores}