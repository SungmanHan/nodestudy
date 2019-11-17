const path = require("path");
const {Sequelize,sequelize} = require("./sequelize-conn");

const Model = Sequelize.Model();
class User extends Model{

}

User.init({
    username: {type:Sequelize.STRING, allowNull:false}
}, {
    sequelize,
    modelName:"users2"
});

User.sync({force:true});

module.exports = {User}