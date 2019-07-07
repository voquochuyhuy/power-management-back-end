/**
 * Arduino.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    name: {
      type: 'string',
      defaultsTo: '',
      maxLength: 200,
      example: 'device 1'
    },

    provisionCode: {
      type: 'string',
      required: true,
      unique: true,
    },

    description: {
      type: 'string',
      description: 'Note something you want about this Arduino',
      maxLength: 200,
      example: 'Arduino Cui Bap'
    },

    // version: {
    //   type: 'string',
    //   description: 'testing, not now the actual meaning behind this',
    // },

    status: {
      type: 'string',
      isIn: ['active', 'deactive'],
      defaultsTo: 'deactive',
      example: 'active',
      description: 'The status of board'
    },

    // macAddress: {
    //   type: 'string',
    //   description: 'Hardwares MAC address of Arduino',
    //   example: '{0xDE, 0xED, 0xBA, 0xFE, 0xFE, 0xED}',
    //   moreInfoUrl: 'https://gooogle.com/mac_address'
    // },

    ipAddress: {
      type: 'string',
      description: 'The IP (ipv4) address of the Arduino - last seen',
      example: '172.16.0.100'
    },

    topicsSubcribed: {
      type: 'string',
      description: 'What topics that Arduino listen to',
      isIn: ['power', 'status'],
      example: 'power'
    },

    maxPins: {
      type: 'number',
      description: 'Maximum number of pins that Arduino can control',
      example: 15,
      defaultsTo: 1
    },

    socketQuantity: {
      type: 'number',
      description: 'Current number of pins controlled by Board',
      example: 10,
      defaultsTo: 0
    },

    requestInterval: {
      type: 'number',
      description: 'Number in seconds interval for sending message to server',
      example: 300,
      defaultsTo: 300
    },

    ownedBy: {
      model: 'user',
      description: 'the user that owns this board'
    },

    lastSeenAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
      example: 1502844074211
    },

    updatedAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
      example: 1502844074211
    },

    deletedAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
      example: 1502844074211
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    // n/a
    pins: {
      collection: 'pin',
      via: 'belongTo'
    },
  },

};
