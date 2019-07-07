parasails.registerPage('board', {
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
    console.log('-------\n-------\n-------\n-------\n-------\n-------\n-------\n' + this.boardId);

  },
  mounted: async function () {

    console.log('-------\n-------\n-------\n-------\n-------\n-------\n-------\n' + this.boardId);


    let boardName = $('#boardName');
    let boardDescription = $('#boardDescription');
    let macAddress = $('#macAddress');
    let maxPins = $('#maxPins');
    let requestInterval = $('#requestInterval');

    let boId = this.boardId;

    function getBoardViewBoard(callback) {
      $.getJSON("/board/" + boId, function (boardData) {
        boardName.text(boardData.name);
        boardDescription.text(boardData.description);
        macAddress.text(boardData.macAddress)
        maxPins.text(boardData.maxPins);
        requestInterval.text(boardData.requestInterval);
        for (let i = 0; i < boardData.pins.length; i++) {
          let pinTag = $("<div></div>").addClass("container-fluid clearfix bg-light");
          let order = $("<div></div>").text(i);
          order.addClass("w-25 float-left btn btn-info w-4");
          let pinValue = $("<span></span>").text("Current value: " + boardData.pins[i].lastCurrentValue);
          pinValue.addClass("float-left");
          console.log("enable? " + boardData.pins[i].isEnable)
          let togglePinTag = $("<div></div>");
          togglePinTag.addClass("w-25 float-right btn w-5 btn-toggle").attr("id", boardData.pins[i].pinNumber)

          // hiển thị trạng thái pin hiện tại
          if (boardData.pins[i].isEnable) {
            togglePinTag.text("ON").addClass("btn-success");
          } else {
            togglePinTag.text("OFF").addClass("btn-danger");
          }

          pinTag.append(order, pinValue, togglePinTag);
          $("#menu1").append(pinTag);
        }
        callback(boardData);
      });
    };

    getBoardViewBoard(function (boardData) {

      // toggle power all
      $("body").on("click", ".power-pin", function (event) {
        let commandData = $(this).index() == 2 ? 'off' : 'on';
        // alert($(this).index());
        $.ajax({
          url: "/api/v1/board/" + boardData.id + "/toggle-all",
          type: 'PUT',
          data: {
            command: commandData,
          },
          success: function (result) {
            alert(commandData + " thành công!");
          },
          error: function () {
            alert(commandData + " không thành công");
          }
        });
      });

      // toggle power pin
      $("body").on("click", ".btn-toggle", function (event) {
        var currentBtn = $(this);
        currentBtn.toggleClass("btn-success");
        currentBtn.toggleClass("btn-danger");
        currentBtn.text(currentBtn[0].textContent === "ON" ? "OFF" : "ON");
        let commandDataPin = currentBtn[0].textContent.toLowerCase();

        $.ajax({
          url: "/api/v1/board/" + boardData.id + "/toggle/" + currentBtn.attr("id"),
          type: 'PUT',
          data: {
            command: commandDataPin,
          },
        });
      });
    });
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
  }
});