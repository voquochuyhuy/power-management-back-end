module.exports = {


  friendlyName: 'Update pin status',


  description: 'Subscribe to power/status channel to update value of Electronic Intensity and Current Status.',


  inputs: {

  },


  exits: {
    success: {
      outputFriendlyName: 'Email delivery report',
      outputDescription: 'A dictionary of information about what went down.',
      outputType: {
        loggedInsteadOfSending: 'boolean'
      }
    }
  },


  fn: async function (inputs, exits) {

    const workerName = `pins-status-worker`;
    sails.log.info(`Sails worker '${workerName}' has started`);

    try {
      const channel = await sails.hooks.rabbitmq.getChannel();

      if (!channel) {
        throw new Error('RabbitMQ channel is undefined');
      }

      const statusKey = 'power.pins.status';

      const ex = 'amq.topic';
      channel.assertExchange(ex, 'topic', { durable: true });

      const queueName = `pins_status_queue`;
      const queue = await channel.assertQueue(queueName, { durable: true });


      console.log(' [*] Waiting for messages from client.');

      let keys = [statusKey];
      keys.forEach(key => {
        channel.bindQueue(q.queue, ex, key);
      });

      channel.consume(q.queue, function (msg) {
        try {
          const now = Date.now();
          console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
          console.log(msg.content);

          const record = JSON.parse(msg.content.toString());
          // TODO: Update to DB

          // Worker proceed message
          channel.ack(msg);
        } catch (error) {
          sails.log.error(`Sails worker '${workerName}' process message error: `, error);
        }
      });

    } catch (error) {
      sails.log.error(`Sails worker '${workerName}' error: `, error);
      throw error;
    }



  }


};
