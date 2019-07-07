module.exports = {


  friendlyName: 'Toggle Pin Helpers',


  description: 'Toggle pin helpsers use AMQP to send message to MQ Rabbit. Should know send to WHOM and WHAT messages',


  inputs: {
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


  fn: async function ({ pinNumber, command }, exits) {

    const channel = await sails.hooks.rabbitmq.getChannel();

    if (!channel) {
      throw new Error('RabbitMQ channel is undefined');
    }

    const exchange = 'amq.topic';
    const routingKey = 'power.command';
    channel.assertExchange(exchange, 'topic', {durable: true});

    let flag = (command === 'on') ? 1 : 0;
    let buffer = Buffer.from([pinNumber, flag]);
    console.log(`Pin: ${pinNumber} - command : ${command}`);
    // console.log(buffer);

    console.log(` [x] Sent to topic - '${routingKey}': ${buffer}`);
    const ok = await channel.publish(exchange, routingKey, buffer);

    if (ok) {
      // All done.
      return exits.success(`ok`);
    }
    throw new Error('Unable to publish message');

  }


};

