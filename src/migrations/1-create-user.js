const { v4: uuid} = require('uuid')
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('users', {
      _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users')
  },
}
