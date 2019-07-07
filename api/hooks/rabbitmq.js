const amqplib = require('amqplib');
const { isFatalError } = require('amqplib/lib/connection');
const retry = require('async-retry');
require('dotenv').config();

module.exports = function (sails) {
  let _thisHook;
  let _channel;
  let _confirmChannel;

  /**
   * Hook configs are parameters passed to `amqplib.connect()
   *
   * See: http://www.squaremobius.net/amqp.node/channel_api.html#connect
   */
  const _defaultConfigs = {
    url: process.env.RABBITMQ_URL,
    socketOptions: {}
  };

  return {
    /**
     * Hook configs are parameters passed to `amqplib.connect()
     *
     * See: http://www.squaremobius.net/amqp.node/channel_api.html#connect
     */
    defaults: {
      rabbitmq: _defaultConfigs
    },
    initialize: async function initializeFn(cb) {
      try {
        _thisHook = this;

        _thisHook.connection = await _thisHook.connectToRabbitMq();

        _thisHook.connection.on('error', function connectionErrorHandler(error) {
          sails.log.error('RabbitMQ connection emitted error: \n' + error.toString());

          setTimeout(async () => {
            _thisHook.connection = await _thisHook.connectToRabbitMq();
          }, 300);
        });

        _thisHook.connection.on('close', function connectionCloseHandler(error) {
          if (!isFatalError(error)) {
            sails.log.info('RabbitMQ connection closed but not by fatal error: \n' + error.toString());
            return
          };

          sails.log.error('RabbitMQ connection closed on error: \n' + error.toString());
          setTimeout(async () => {
            _thisHook.connection = await _thisHook.connectToRabbitMq();
          }, 300);
        });

        sails.on('lower', function () {
          sails.log.verbose('Closing connection to RabbitMQ...');
          _thisHook.connection.close();
        });

        cb();
      } catch (error) {
        sails.log.error('RabbitMQ Hook initializing error: \n' + error.toString());
        cb();
      }
    },

    connectToRabbitMq: async function connectToRabbitMqFn() {
      return retry(async bail => {
        sails.log.verbose('RabbitMQ connection initializing...');
        const conn = await amqplib.connect(
          sails.config.rabbitmq.url,
          sails.config.rabbitmq.socketOptions
        );

        if (conn) {
          sails.log.verbose('RabbitMQ connection successfully initialized!');
          return conn;
        }
      }, {
          retries: 5,
        });
    },

    /**
     * Expose an `amqplib#Connection`
     *
     * Connection usage:
     *   http://www.squaremobius.net/amqp.node/channel_api.html#models
     */
    connection: null,


    /**
     * Get RabbitMQ channel
     *
     * See: http://www.squaremobius.net/amqp.node/channel_api.html#channel
     *
     * @returns Promise<amqplib#Channel>
     */
    getChannel: async function getChannelFn() {
      try {
        if (_channel) {
          return _channel;
        }

        sails.log.debug('RabbitMQ creating channel...');
        _channel = await _thisHook.connection.createChannel();
        sails.log.debug('RabbitMQ channel successfully created!');

        return _channel;
      } catch (error) {
        sails.log.error('RabbitMQ channel error:' + error.toString());
      }
    },
    /**
     * Get RabbitMQ confirm channel
     *
     * See: http://www.squaremobius.net/amqp.node/channel_api.html#channel
     *
     * @returns Promise<amqplib#Channel>
     */
    getConfirmChannel: async function getConfirmChannelFn() {
      try {
        if (_confirmChannel) {
          return _confirmChannel;
        }

        sails.log.debug('RabbitMQ creating channel...');
        _confirmChannel = await _thisHook.connection.createConfirmChannel();
        sails.log.debug('RabbitMQ channel successfully created!');

        return _confirmChannel;
      } catch (error) {
        sails.log.error('RabbitMQ channel error:' + error.toString());
      }
    },
  };
};
