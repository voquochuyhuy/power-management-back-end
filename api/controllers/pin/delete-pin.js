module.exports = {


  friendlyName: 'Delete pin',


  description: '',


  inputs: {

    id: {
      type: 'number',
      description: 'id of pin to delete',
      required: true
    }

  },


  exits: {

    forbidden: {
      responseType: 'forbidden',
    },

    notFound: {
      responseType: 'notFound',
    }

  },


  fn: async function (inputs, exits) {

    var pinToDelete = await Pin.findOne({ id: inputs.id });
    if (!pinToDelete) {
      throw 'notFound'
    }

    var boardRecord = await Board.findOne({ id: pinToDelete.belongTo });
    if (!boardRecord) {
      throw { notFound: 'this pin does not belong to any board' }
    }

    if (boardRecord.ownedBy != this.req.me.id) {
      throw 'forbidden';
    }

    await Pin.destroy({ id: inputs.id });

    await Board.updateOne({ id: boardRecord.id })
      .set({
        socketQuantity: boardRecord.socketQuantity - 1,
      });

    return exits.success();

  }


};
