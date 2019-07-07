module.exports = {


  friendlyName: 'New Board',


  description: 'New board.',


  extendedDescription: `Create a new board`,

  inputs: {
    name: {
      type: 'string',
      required: true,
      unique: true,
      maxLength: 200,
      example: 'device 1'
    },

    description: {
      type: 'string',
      description: 'Note something you want about this Arduino',
      maxLength: 200,
      example: 'Arduino Cui Bap'
    },

    macAddress: {
      type: 'string',
      unique: true,
      description: 'Hardwares MAC address of Arduino',
      example: '{0xDE, 0xED, 0xBA, 0xFE, 0xFE, 0xED}',
      moreInfoUrl: 'https://gooogle.com/mac_address'
    },

    maxPins: {
      type: 'number',
      description: 'Maximum number of pins that Arduino can control',
      example: 15,
      defaultsTo: 1
    },

    requestInterval: {
      type: 'number',
      description: 'Number in seconds interval for sending message to server',
      example: 300,
      defaultsTo: 300
    },
  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request ' +
        'parameters should have been validated/coerced _before_ they were sent.'
    },

    nameAlreadyInUse: {
      statusCode: 409,
      description: 'The provided name is already in use.',
    },

    redirect: {
      description: 'Added new Board successfully, redirect to view the Board',
      responseType: 'redirect'
    }

  },


  fn: async function (inputs, exits) {

    var newName = inputs.name.toLowerCase();

    //TODO: Verify macAddress - unique and valid
    //TODO: Only Admin can create a new board
    //TODO: Generate `provisionCode` from XXX
    var newBoardRecord = await Board.create({
      name: newName,
      description: inputs.description,
      macAddress: inputs.macAddress,
      maxPins: inputs.maxPins,
      requestInterval: inputs.requestInterval
    })
      .intercept('E_UNIQUE', 'nameAlreadyInUse')
      .intercept({ name: 'UsageError' }, 'invalid')
      .fetch();

    if (sails.config.custom.enableAutoCreatePins) {
      for (var i = 0; i < inputs.maxPins; i++) {
        // Create a new pin

        var newPin = await Pin.create({
          name: `${newBoardRecord.name} - ${i}`,
          belongTo: newBoardRecord.id,
          pinNumber: i
        }).fetch();

        // Update to board
        await Board.addToCollection(newPin.id, 'pins').members([newBoardRecord.id]);

      }

      // Add pins to new board.
    } else {
      sails.log.info('Skipping create pins automatically (`enableAutoCreatePins` is disabled)');
    }

    return exits.success();
  }


};
