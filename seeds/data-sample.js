/**
 * Testing
 * Seed fake data for testing
 *
 *
 */

/* eslint-disable no-restricted-syntax, no-await-in-loop */

const faker = require('faker');

module.exports.seed = async db => {
  // Create 10 random website users (as an example)
  const users = Array.from({
    length: 10
  }).map(() => ({
    fullName: faker.name.findName(),
    emailAddress: faker.internet.email(),
    password: faker.internet.password(),
    address: faker.address.streetAddress(),
    phoneNumber: faker.phone.phoneNumber(),
    organizationName: faker.random.word()
  }));

  await Promise.all(
    users.map(user =>
      db
      .table('users')
      .insert(user)
      .returning('id')
      .then(rows =>
        db
        .table('users')
        .where('id', '=', rows[0])
        .first()
        .then(u =>
          console.log(u)
        ),
      )
      .then(row => Object.assign(user, row)),
    ),
  );

  // Create 500 boards
  const stories = Array.from({
    length: 500
  }).map(() =>
    Object.assign({
      ownedBy: users[faker.random.number({
          min: 0,
          max: users.length - 1
        })].id,
        name: faker.lorem
          .sentence(faker.random.number({
            min: 4,
            max: 7
          }))
          .slice(0, -1)
          .substr(0, 80),
      },
      Math.random() > 0.3 ? { text: faker.lorem.text()}
      : { url: faker.internet.url() },
      (date => ({
        lastSeenAt: date,
        updated_at: date
      }))(faker.date.past()),
    ),
    provisionCode: faker.random.uuid,
    maxPins: faker.random.number({min: 1, max: 16}),
    socketQuantity: faker.random.number({min: 1, max: maxPins})
  );

  await Promise.all(
    stories.map(story =>
      db
      .table('stories')
      .insert(story)
      .returning('id')
      .then(rows =>
        db
        .table('stories')
        .where('id', '=', rows[0])
        .first(),
      )
      .then(row => Object.assign(story, row)),
    ),
  );

  // Create some user comments
  const comments = Array.from({
    length: 2000
  }).map(() =>
    Object.assign({
        story_id: stories[faker.random.number({
          min: 0,
          max: stories.length - 1
        })].id,
        author_id: users[faker.random.number({
          min: 0,
          max: users.length - 1
        })].id,
        text: faker.lorem.sentences(faker.random.number({
          min: 1,
          max: 10
        })),
      },
      (date => ({
        created_at: date,
        updated_at: date
      }))(faker.date.past()),
    ),
  );

  await Promise.all(
    comments.map(comment =>
      db
      .table('comments')
      .insert(comment)
      .returning('id')
      .then(rows =>
        db
        .table('comments')
        .where('id', '=', rows[0])
        .first(),
      )
      .then(row => Object.assign(comment, row)),
    ),
  );
};
