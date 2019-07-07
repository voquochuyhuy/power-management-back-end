module.exports = {


  friendlyName: 'Toggle all',


  description: '',


  inputs: {
    id: {
      description: 'The id of the board to toggle',
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
    notFound: {
      responseType: 'notFound'
    },

    forbidden: {
      responseType: 'forbidden'
    },
  },


  fn: async function ({ id, command }, exits) {

    var boardRecord = await Board.findOne({ id }).populate('pins');

    // Can not find the board
    if (!boardRecord) {
      throw 'notFound';
    }
    // Board isnt Active
    if (boardRecord.status !== 'active') {
      throw 'forbidden'
    }
    // TODO: Fetch board status, pins status first, then push msg(s)

    // Enable all-pins
    for (let pin of boardRecord.pins) {
      // FIXME: Whatif pin.isEnabled === command, can reduce number of msgs

      // Update status to RabbitMQ
      // var result = await sails.helpers.togglePin.with({ pinNumber: pin.pinNumber, command });
      let pinNumber = -1;
      var result = await sails.helpers.newTogglePin.with({ id, pinNumber, command });
      console.log(`${pin.pinNumber}, ${command}`);

      if (result) {
        // FIXME: Whatif result ACK failed.
        // Update status in DB
        await Pin.update({ id: pin.id }).set({ isEnable: (command === 'on') });
      }
    }

    return exits.success();

  }


};
