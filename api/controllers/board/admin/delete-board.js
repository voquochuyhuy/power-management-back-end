module.exports = {


  friendlyName: 'Delete board',


  description: 'Delete a board',


  inputs: {

    id: {
      description: 'The id of the board to delete',
      type: 'string',
      required: true
    },

  },


  exits: {

    notFound: {
      responseType: 'notFound'
    },

    forbidden: {
      responseType: 'forbidden'
    },

  },


  fn: async function ({ id }) {

    var boardToDelete = await Board.findOne({ id }).populate('pins');

    // TODO: Archive `belong` pins also.
    // TODO: check info user associated with board
    if (!boardToDelete) {
      throw 'notFound';
    }

    // Already In-use
    if (boardToDelete.status !== 'deactive') {
      throw { forbidden: 'Board already in-use' }
    }

    // Owned by other user
    if (boardToDelete.ownedBy != this.req.me.id) {
      throw { forbidden: 'Board belongs to someone else' }
    }

    // Archive board - soft delete
    await Board.archiveOne({ id });

  }


};
