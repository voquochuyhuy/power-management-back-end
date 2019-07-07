module.exports = {


  friendlyName: 'View new board',


  description: 'Display "New board" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/board/new-board'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
