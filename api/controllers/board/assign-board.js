module.exports = {


  friendlyName: 'Activate board',


  description: '',


  inputs: {

    name: {
      type: 'string',
      required: true,
      unique: true,
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

    socketQuantity: {
      type: 'number',
      description: 'Current number of pins controlled by Board',
      required: true,
    },

  },

  exits: {

    notFound: {
      responseType: 'notFound'
    },

    forbidden: {
      responseType: 'forbidden'
    },

    badRequest: {
      description: 'invalid parameters',
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs, exits) {

    await sails.getDatastore()
      .transaction(async (db) => {

        var newName = inputs.name.toLowerCase();
        var adminRecord = await User.findOne({ role: 'admin' })
          .usingConnection(db);

        var boardToActive = await Board.findOne({
          provisionCode: inputs.provisionCode,
        })
          .usingConnection(db);

        // board not found
        if (!boardToActive) {
          throw 'notFound';
        }

        // board belong to someone else
        if (boardToActive.ownedBy != adminRecord.id) {
          throw 'forbidden';
        }

        // board belong to admin (admin here is also a user)
        if (boardToActive.name != '') {
          throw 'forbidden';
        }

        // invalid socketQuantity
        if (inputs.socketQuantity > boardToActive.maxPins) {
          throw { badRequest: 'socketQuantity must be less than board\'s maxPins' }
        }

        await Board.update({ provisionCode: inputs.provisionCode })
          .set({
            name: newName,
            description: inputs.description,
            socketQuantity: inputs.socketQuantity,
            status: 'active',
            ownedBy: this.req.me.id
          })
          .usingConnection(db);

        var boardRecord = await Board.findOne({ provisionCode: inputs.provisionCode })
          .usingConnection(db);

        if (sails.config.custom.enableAutoCreatePins) {
          for (var i = 0; i < inputs.socketQuantity; i++) {
            // Create a new pin
            await Pin.create({
              name: `${boardRecord.name} - ${i}`,
              belongTo: boardRecord.id,
              pinNumber: i
            })
              .usingConnection(db);


            // Update to board
            // await Board.addToCollection(newPin.id, 'pins').members([boardRecord.id]);
          }
        } else {
          sails.log.info('Skipping create pins automatically (`enableAutoCreatePins` is disabled)');
        }
      })

    // All done.
    return exits.success();

  }


};
