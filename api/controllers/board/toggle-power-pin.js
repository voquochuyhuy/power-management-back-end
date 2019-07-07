module.exports = {


  friendlyName: 'Toggle Power for Pin Number',


  description: '',


  inputs: {
    id: {
      description: 'The id of the board to act',
      type: 'string',
      required: true
    },

    pinNumber: {
      description: 'The position number of Pin on the board start with zezo',
      type: 'number',
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
    notFound: {
      responseType: 'notFound'
    },

    forbidden: {
      responseType: 'forbidden'
    },

    wrongPin: {
      description: 'Input the wrong position of the Pin, Must larger than zero and below maximum pin on the board.'
    }
  },


  fn: async function ({ id, pinNumber, command }, exits) {
    sails.log.debug(`id: ${id}, pin: ${pinNumber}`);
    var boardRecord = await Board.findOne({ id }).populate('pins');

    // Can not find the board
    if (!boardRecord) {
      throw 'notFound';
    }
    // Board isnt Active
    if (boardRecord.status !== 'active') {
      // FIXME:
      throw 'forbidden'
    }

    if (pinNumber < 0 && pinNumber > boardRecord.maxPins) {
      throw 'wrongPin'
    }

    let pin = _.find(boardRecord.pins, { pinNumber });
    sails.log.debug(pin);

    if (!pin) {
      throw 'wrongPin';
    }

    // Update status to RabbitMQ
    // var result = await sails.helpers.togglePin.with({ pinNumber, command });
    var result = await sails.helpers.newTogglePin.with({ id, pinNumber, command });
    if (result) {
      // Update status in DB
      await Pin.update({ id: pin.id }).set({ isEnable: (command === 'on') });

      return exits.success();
    }

    throw new Error('Unable to publish message');

  }


};
