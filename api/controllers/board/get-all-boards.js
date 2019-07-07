module.exports = {


  friendlyName: 'View board',


  description: 'Display all Boards.',

  inputs: {

    page: {
      type: 'number',
      required: true,
    },

    limit: {
      type: 'number',
      defaultsTo: 10
    },

    isAssigned: {
      type: 'boolean',
      defaultsTo: true
    },

    role: {
      type: 'string',
      isIn: ['admin', 'user'],
      defaultsTo: 'user'
    },

  },

  exits: {

    success: {

    },

  },


  fn: async function (inputs, exits) {

    // TODO: Update pin status to db via helper
    // var result = await sails.helpers.updatePinStatus();

    if (inputs.role == 'admin') {
      if (this.req.me.role != 'admin') {
        return this.res.forbidden("You don't have permission to do this request")
      }
      if (inputs.isAssigned) {
        var boardList = await Board.find({
          name: {
            '!=': ''
          }
        })
          .populate(['pins', 'ownedBy'])
          .skip((inputs.page - 1) * inputs.limit)
          .limit(inputs.limit);
      } else {
        var boardList = await Board.find({
          ownedBy: this.req.me.id,
          name: ''
        })
          .populate(['pins', 'ownedBy'])
          // .populate('pins')
          .skip((inputs.page - 1) * inputs.limit)
          .limit(inputs.limit);
      }
    } else {
      var boardList = await Board.find({
        name: {
          '!=': ''
        },
        ownedBy: this.req.me.id
      })
        .populate(['pins', 'ownedBy'])
        .skip((inputs.page - 1) * inputs.limit)
        .limit(inputs.limit);
    }

    sails.log(boardList);

    // remove unnecessary user properties
    boardList.forEach((item, index) => {
      item.ownedBy = _.pick(item.ownedBy, ['id', 'fullName'])
    });

    return exits.success({ boardList });

  }


};
