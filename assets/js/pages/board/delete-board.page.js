parasails.registerPage('delete-board', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function () {

    function getNameAndRenderHTML(callback) {
      $.getJSON("/board", function (result) {
        for (let i = 0; i < result.length; i++) {
          let arduinoTag = $("<div></div>").addClass("custom-control custom-checkbox my-1 mr-sm-2");
          let tmpInput = $("<input></input>").addClass("custom-control-input").attr({ "type": "checkbox", "id": "customControlInline" + i });
          let tmpLabel = $("<label></label>").addClass("custom-control-label").attr("for", "customControlInline" + i).text(result[i].name);
          arduinoTag.append(tmpInput, tmpLabel);
          $("#list-delete-board").after(arduinoTag);
        };
        callback(result);
      });
    };

    getNameAndRenderHTML(function (boardDataDelete) {
      $("#btnDelete").on("click", function () {
        console.log("nhap chuot vao btn");
        for (let i = 0; i < boardDataDelete.length; i++) {
          let currentArduinoTag = "customControlInline" + i;
          if (document.getElementById(currentArduinoTag).checked) {
            console.log("chuan bi xoa mot cai");
            $.ajax({
              url: "/api/v1/board/" + boardDataDelete[i].id,
              type: 'DELETE',
              success: function (result) {
                alert("Xoá thành công!");
              },
              error: function(){
                alert("Vui lòng tắt Board trước khi xoá!");
              }
            });
          } else {
            console.log("1 cai khong xoa duoc");
          }
        }
      });
    });
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
  }
});
