module.exports = {


  friendlyName: 'Ping',


  description: 'Ping something.',


  inputs: {

  },


  exits: {
    bum: {
      statusCode: 201,
      description: 'coi coi giong nhu this.res khong?',
      responseType: 'unauthorized'
    }

  },


  fn: async function (inputs, exits) {

    // return this.res.status(203).send("hihi haha")
    // return exits.status(203).send("using with exits")
    // return this.res.forbidden("cam nha")
    // return this.res.unauthorized();
    // return exits.bum("su dung custom response");
    this.res.forbidden("bi cam roi ma");
    // return this.res.badRequest("bad request");

    // return exits.success('pong');

  }


};
