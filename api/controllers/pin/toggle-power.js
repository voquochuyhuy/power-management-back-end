module.exports = {


  friendlyName: 'Toggle power',


  description: 'Send command to client to power on/off on specific pin',


  inputs: {
    id: {
      description: 'The id of the pin to act',
      type: 'string',
      required: true
    },

    command: {
      description: 'The flags on/off command',
      type: 'string',
      isIn: ['on', 'off'],
      required: true
    }
  },


  exits: {
    success: {
      status: 200,
      description: 'ok'
    },

    notFound: {
      responseType: 'notFound'
    },

    forbidden: {
      responseType: 'forbidden'
    },
  },


  fn: async function ({ id, command }, exits) {

    var pinRecord = await Pin.findOne({ id }).populate('belongTo');

    // Can not find the board
    if (!pinRecord) {
      throw 'notFound';
    }

    // Update status to RabbitMQ
    var result = await sails.helpers.togglePin.with({ pinNumber: pinRecord.pinNumber, command });

    if (result) {
      // Update status in DB
      await Pin.update({ id }).set({ isEnable: (command === 'on') });

      return exits.success();
    }

    throw new Error('Unable to publish message');
  }


};
