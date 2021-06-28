const { Model, Sequelize } = require('sequelize')

const SESSION_SECRET = '11111'

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports = (sequelize, Sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post }) {
      // define association here
      this.hasMany(Post, { foreignKey: 'userId', as: 'posts', onDelete: 'cascade' })
    }


    static hashPassword  = (password) => new Promise( resolve =>
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(password, salt, (err, hash) =>
          resolve(hash)
        )
      )
    )

    static compareHashedPasswords = (password, hashedPassword) => new Promise(resolve =>
      bcrypt.compare(password, hashedPassword,  (err, res) => {
        if (!res) {
          resolve(false);
          return
        }

        resolve(true);
      })
    )

    static async findByCredentials (email, password ) {
      const User = this;
      try {
        const user = await User.findOne({ where: { email } })

        if (!user) {
          return null;
        }

        const isPasswrodCorrect = await User.compareHashedPasswords(password, user.password)
        return isPasswrodCorrect ? user : null;
      }catch (e) {
        return Promise.reject(e)
      }
    }

    static async findByToken ( token ) {
      const User = this;
      try {
        let decoded;
        try {
          decoded = jwt.verify(token, SESSION_SECRET);
        } catch (e) {
          return Promise.reject();
        }

        const user = await User.findOne({ where: { _id: decoded._id, token } })

        if(!user){
          return Promise.reject();
        }

        return user;

      }catch (e) {
        return Promise.reject(e)
      }
    }

    toJSON() {
      return {
        ...this.get(),
        _id: undefined,
        password: undefined,
        token: undefined
      }
    }

    async generateAuthToken () {
      const token = jwt
        .sign(
          {
            _id: this._id,
          },
          SESSION_SECRET
        )
        .toString();

      this.token = token;
      await this.save();
      return token;
    }
  }
  User.init(
    {
      _id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'User must have a name' },
          notEmpty: { msg: 'Name must not be empty' },
        },
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'User must have a email' },
          notEmpty: { msg: 'email must not be empty' },
          isEmail: { msg: 'Must be a valid email address' },
        },
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'User must have a password' },
          notEmpty: { msg: 'password must not be empty' },
        },
      },
      token: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
    }
  )

  User.addHook('beforeCreate',  async user =>
    user.password = await User.hashPassword(user.password)
  )

  User.addHook('beforeUpdate',  async (user, options) => {

    const oldPassword = user.previous('password')
    if ( options.fields.includes('password') && oldPassword !== user.password) {

      const samePassword = await User.compareHashedPasswords(user.password, oldPassword)
      if(!samePassword){
        user.password = await User.hashPassword(user.password);
      }else{
        user.password = oldPassword;
      }
    }

  })

  return User
}
