module.exports = {


  friendlyName: 'View delete board',


  description: 'Display "Delete board" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/board/delete-board'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
