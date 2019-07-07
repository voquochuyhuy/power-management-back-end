module.exports = {


  friendlyName: 'Update board',


  description: '',


  inputs: {

    id: {
      type: 'string',
      description: 'id of the board to update',
      require: true
    },

    name: {
      type: 'string',
      description: 'board\'s new name'
    },

    description: {
      type: 'string',
      description: 'board\'s description'
    },

    status: {
      type: 'string',
      description: 'the status of board',
      isIn: ['active', 'deactive']
    },

    // socketQuantity: {
    //   type: 'number',
    //   description: 'current number of pin controlled by board'
    // }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    var boardRecord = await Board.findOne({ id: inputs.id }).populate('pins');
    if (!boardRecord) {
      return this.res.notFound();
    }
    // sails.log(boardRecord);
    // sails.log(boardRecord.id);
    if (boardRecord.ownedBy != this.req.me.id) {
      // sails.log('board: ' + boardRecord.ownedBy);
      // sails.log("id owner: " + this.req.me.id);
      return this.res.forbidden();
    }
    await Board.update(inputs.id)
      .set({
        name: inputs.name ? inputs.name : boardRecord.name,
        description: inputs.description ? inputs.description : boardRecord.description,
        status: inputs.status ? inputs.status : boardRecord.status,
        // socketQuantity: inputs.socketQuantity ? inputs.socketQuantity : boardRecord.socketQuantity,
      });

    // if (inputs.socketQuantity != boardRecord.socketQuantity) {}
      // TODO: add or remove pin
      // check auto create pin
      // if (sails.config.custom.enableAutoCreatePins) {

      // }

      return exits.success();

  }


};
