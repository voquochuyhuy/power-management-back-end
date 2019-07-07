module.exports = {


  friendlyName: 'Get all users',


  description: '',


  inputs: {

    page: {
      type: 'number',
      required: true,
    },

    limit: {
      type: 'number',
      defaultsTo: 10
    },

  },


  exits: {

    success: {

    }

  },


  fn: async function (inputs, exits) {

    var userList = await User.find()
      .skip((inputs.page - 1) * inputs.limit)
      .limit(inputs.limit);

    // remove unnecessary user properties
    userList.forEach((item, index) => {
      userList[index] = _.pick(item, ['id', 'fullName', 'emailAddress', 'phoneNumber', 'address', 'organizationName', 'role', 'emailStatus'])
    });

    // All done.
    return exits.success({ userList });

  }


};
