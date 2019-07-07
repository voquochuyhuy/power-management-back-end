module.exports = {


  friendlyName: 'Get user',


  description: '',


  inputs: {

    id: {
      type: 'number',
      description: 'id of the user to be view',
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

    },

    forbidden: {
      responseType: 'forbidden'
    },

    notFound: {
      responseType: 'notFound'
    }

  },


  fn: async function (inputs, exits) {

    var userRecord = await User.findOne({ id: inputs.id });

    // user notFound
    if (!userRecord) {
      throw 'notFound'
    }

    if (inputs.role == 'admin') {
      if (this.req.me.role != 'admin') {
        throw { forbidden: 'You\'re not admin' };
      }
    } else {
      // not from owner's record
      if (inputs.id != this.req.me.id) {
        throw { forbidden: 'You\'re not allowed to view other\'s user record' }
      }
    }

    // remove unnecessary user properties
    userRecord = _.pick(userRecord, ['id', 'fullName', 'emailAddress', 'phoneNumber', 'address', 'organizationName', 'role', 'emailStatus']);

    // All done.
    return exits.success({ userRecord });

  }


};
