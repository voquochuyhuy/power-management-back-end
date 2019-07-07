module.exports = {


  friendlyName: 'Add unactive board',


  description: '',


  inputs: {

    provisionCode: {
      type: 'string',
      required: true,
      unique: true,
    },

    maxPins: {
      type: 'number',
      required: true,
      description: 'Maximum number of pins that Arduino can control',
      example: 15,
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    await Board.create({
      provisionCode: inputs.provisionCode,
      maxPins: inputs.maxPins,
      ownedBy: this.req.me.id
    })
      .intercept('E_UNIQUE', 'codeAlreadyInUse')
      .intercept({ name: 'UsageError' }, 'invalid')
      .fetch();

    // All done.
    return;

  }


};
