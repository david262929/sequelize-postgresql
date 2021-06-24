'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert(
      'posts',
      [
        {
          _id: "e7e1792c-9147-4fe6-be22-3a9c8beb9a92",
          body: 'Lorem Lorem',
          userId: 'e7e1792c-9147-4fe6-be22-3a9c8beb9c92',
          createdAt: '2021-06-23T16:30:07.592Z',
          updatedAt: '2021-06-23T16:30:07.592Z',
        },
        {
          _id: "e7e1792c-9147-4fe6-be22-3a9c8beb9a93",
          body: 'Lorem Lorem 1',
          userId: 'e7e1792c-9147-4fe6-be22-3a9c8beb9c92',
          createdAt: '2021-06-23T16:30:07.592Z',
          updatedAt: '2021-06-23T16:30:07.592Z',
        },
        {
          _id: "e7e1792c-9147-4fe6-be22-3a9c8beb9a94",
          body: 'Lorem Lorem 2',
          userId: 'e7e1792c-9147-4fe6-be22-3a9c8beb9c92',
          createdAt: '2021-06-23T16:30:07.592Z',
          updatedAt: '2021-06-23T16:30:07.592Z',
        },

        {
          _id: "e7e1792c-9147-4fe6-be22-3a9c8beb9d93",
          body: 'Lorem ipsum',
          userId: 'e7e1792c-9147-4fe6-be22-3a9c8beb9c93',
          createdAt: '2021-06-23T16:30:07.592Z',
          updatedAt: '2021-06-23T16:30:07.592Z',
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {})
  }
};
