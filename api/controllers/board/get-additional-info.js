module.exports = {


  friendlyName: 'Get additional info',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    var addInfo = {}
    additionalInfo.numRecord = await Board.count({ownedBy: this.req.me.id});

    // All done.
    return exits.success({additionalInfo});

  }


};
