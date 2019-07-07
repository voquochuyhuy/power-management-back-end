module.exports = {


  friendlyName: 'View board',


  description: 'Display specific board.',

  inputs: {

    id: {
      type: 'number',
      description: 'id of the board to be view',
      require: true,
    },

    role: {
      type: 'string',
      isIn: ['admin', 'user'],
      defaultsTo: 'user'
    }

  },

  exits: {

    success: {
    }

  },


  fn: async function (inputs, exits) {

    var boardRecord = await Board.findOne({ id: inputs.id }).populate(['pins', 'ownedBy']);


    if (!boardRecord) {
      return this.res.notFound();
    }

    if (inputs.role == 'admin') {
      // not admin
      if (this.req.me.id != 'admin') {
        return this.res.forbidden('You\'re not admin');
      }
    } else {
      // user but not board's owner
      if (boardRecord.ownedBy.id != this.req.me.id) {
        return this.res.forbidden('You\'re not allowed to view someone else\'s board')
      }
    }

    // remove unnecessary user properties
    boardRecord.ownedBy = _.pick(boardRecord.ownedBy, ['id', 'fullName']);

    // Respond with view.
    return exits.success({ boardRecord });

  }


};
