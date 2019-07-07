module.exports = {


  friendlyName: 'Unassign board',


  description: '',


  inputs: {

    id: {
      type: 'string',
      require: true
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


  fn: async function (inputs, exits) {

    let boardToCheck = await Board.findOne({ id: inputs.id });

    // board not found
    if (!boardToCheck) { throw 'notFound' }

    // board already in-use
    if (boardToCheck.status == 'active') {
      throw { forbidden: 'Board already in-use' }
    }

    // board belongs to someone else
    if (boardToCheck.ownedBy != this.req.me.id) {
      throw { forbidden: 'Board belongs to someone else' }
    }

    var adminRecord = await User.findOne({ role: 'admin' });

    var updatedRecord = await Board.updateOne({
      id: inputs.id,
      ownedBy: this.req.me.id
    })
      .set({
        name: '',
        description: '',
        ownedBy: adminRecord.id,
        socketQuantity: 0,
      });


    await Pin.archive({ belongTo: updatedRecord.id });
    // await Pin.destroy({belongTo:updatedRecord.id});
    // await Board.replaceCollection(updatedRecord.id, 'pins')
    // .member([]);

    // All done.
    return exits.success();

  }
};
