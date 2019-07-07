module.exports = {


  friendlyName: 'Toggle Pin Helpers',


  description: 'Toggle pin helpsers use AMQP to send message to MQ Rabbit. Should know send to WHOM and WHAT messages',


  inputs: {
    id: {
      description: 'The id of the board to act',
      type: 'string',
      required: true
    },
    pinNumber: {
      type: 'number',
      description: 'The command as number send to board',
      required: true
    },

    command: {
      type: 'string',
      isIN: ['on', 'off'],
      description: 'Command on/off to pin',
      required: true,
    }
  },


  exits: {
    success: {
      description: 'Update successfull'
    },

  },


  fn: async function ({ id, pinNumber, command }, exits) {

    const channel = await sails.hooks.rabbitmq.getChannel();

    if (!channel) {
      throw new Error('RabbitMQ channel is undefined');
    }

    //TODO: Read from rabbit config file for env vars and also move to rabbit hooks
    // exchange
    // routing
    // topic list
    // virtual host
    // qos
    // retain
    // Read TOPIC_STRUCTURE for `routingKey` and `exchange`
    const exchange = 'amq.topic';
    // const routingKey = 'power.cmd';

    channel.assertExchange(exchange, 'topic', { durable: true });

    let flag = (command === 'on') ? '1' : '0';
    //   let buffer = Buffer.from([pinNumber, flag]);
    var boardRecord = await Board.findOne({ id }).populate('pins');
    // sails.log(boardRecord);

    var sumRecord = await boardRecord.pins.length;
    // sails.log({ sumRecord });
    //   console.log(`Pin: ${pinNumber} - command : ${command}`);
    // console.log(buffer);

    /*
    MQTT Commands List:
    Topic: "CMD"
    Messages:
        1. "FSTE"    : Switch to Timer Mode
        2. "FSRE"    : Switch to Remote Mode
        3. "FPxxxxxxE": Turn Pi x = 1 - ON, x = 0 - OFF
    */

    // --- Command Mode 1
    // TODO:
    // --- Command Mode 2
    // TODO:

    // --- Command Mode 3

    // initialize commandChain
    var commandChain = 'FP';

    if (pinNumber == -1) {
      for (let i = 0; i < sumRecord; i++) {
        commandChain += flag;
      }
    } else {
      for (let i = 0; i < sumRecord; i++) {
        var index = _.findIndex(boardRecord.pins, { pinNumber: i })
        data = boardRecord.pins[index].isEnable ? '1' : '0';
        // boardRecord.pins[i].isEnable ? data = '1' : data = '0';
        if (boardRecord.pins[index].pinNumber == pinNumber) { data = flag; }
        commandChain += data;
      };
    }
    commandChain += 'E';

    sails.log({ commandChain });
    let payload = Buffer.from(commandChain);

    let routingKey = `${boardRecord.provisionCode}.CMD`;
    // let routingKey = `ARD-002.CMD`;
    console.log(` [x] Sent to topic - '${routingKey}': ${payload}`);
    const ok = await channel.publish(exchange, routingKey, payload);

    if (ok) {
      return exits.success(`ok`);
    }
    throw new Error('Unable to publish message');

  }


};

