module.exports = {


  friendlyName: 'New pin',


  description: 'Create a new pin and add it into a board',


  inputs: {
    boardId: {
      type: 'string',
      required: true
    },

    name: {
      type: 'string',
      required: true,
      unique: true,
      maxLength: 200,
      example: 'Pin 1-1'
    },

    pinNumber: {
      type: 'number',
      required: true,
      description: 'The position of pin on Arduino boards, start from 0',
      example: 1
    },

    isEnable: {
      type: 'boolean',
      description: 'Turn on/off this pin corresponding with true/false value',
      example: true,
      defaultsTo: true,
    },

    lastCurrentValue: {
      type: 'number',
      description: 'The last value of Electric Intensy (Ampere)',
      example: 2.5,
      defaultsTo: 0
    }
  },


  exits: {
    success: {
      outputDescription: 'The newly created `Thing`.',
      outputExample: {}
    },

    forbidden: {
      responseType: 'forbidden'
    },

    existingPin: {
      responseType: 'badRequest'
    },

    notFound: {
      responseType: 'notFound',
      outputDescription: 'Board not found by given ID'
    },

    reachedMaxPins: {
      responseType: 'badRequest',
    }
  },


  fn: async function (inputs, exits) {

    var existingBoard = await Board.findOne({ id: inputs.boardId }).populate('pins');

    if (existingBoard.ownedBy != this.req.me.id) {
      throw { forbidden: 'you\'re not allowed to edit someone else\'s board' }
    }

    if (existingBoard) {
      if (_.find(existingBoard.pins, { pinNumber: inputs.pinNumber })) {
        throw { existingPin: 'existing pinNumber' };
      }

      if (existingBoard.socketQuantity >= existingBoard.maxPins) {
        throw { reachedMaxPins: 'current socketQuantity reached maxPins number' }
      }

      var newPinRecord = await Pin.create({
        name: inputs.name,
        pinNumber: inputs.pinNumber,
        belongTo: inputs.boardId
      })
        .intercept('E_UNIQUE', 'nameAlreadyInUse')
        .fetch();

      await Board.updateOne({ id: inputs.boardId })
        .set({
          socketQuantity: existingBoard.socketQuantity + 1,
        });

    } else {
      throw 'notFound';
    }


    // All done.
    return exits.success({
      id: newPinRecord.id
    });
  }


};
