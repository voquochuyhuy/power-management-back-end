# Power Management

a [Sails v1](https://sailsjs.com) application

**Required**: `PosgresQL v9.6.7` is running.

For get Arduino Sourcecode

```bash
git submodule init
git submodule update
```

## Migration

Remember to run migration before develop or deploy.

**!!Caution: Please back up database before run migration**

Run all migrations from oldest to latest:

```sh
DATABASE_URL=postgresql://user:pass@host:port/database npm run migration up
```

Rollback ONE latest migration:

```sh
DATABASE_URL=postgresql://user:pass@host:port/database npm run migration down
```

_See more on [package.json](./package.json) scripts and [`node-pg-migrate CLI`](https://github.com/salsita/node-pg-migrate/blob/master/docs/cli.md)_

## Development

### When creating new model

**DONOT use default migration from Sails to create DB table for model**. Use `npm run migration` instead, this works with library [`node-pg-migrate`](https://github.com/salsita/node-pg-migrate), which is more powerfull and has more features specified for Postgre DB.

### Start Development

```bash
npm install
sails lift
```

## Run (Docker)

Run Posgresql first or using docker container

`./start-postgres-container.sh`

then

`sails lift`

## Deployment (Docker)

**Approach 1**: Build image local

1. `build.sh` - default `development` mode
2. `run.sh` - default `development` mode

**Approach 2**: Pull from Private Docker Hub

1. `docker-compose build`
1. `docker-compose up`

## Configurations

### RabbitMQ

`api/config/local.js`
`api/hooks/rabbitmq.js`

Check URL
Management: `159.89.206.118:15672`

### Policies and Security

`api/config/policies.js`

`api/config/blueprints` - Disable CSRF

`api/config/http.js` - Disable `order` will NOT load correct assets in Webpages


## MQTT with Arduino and Raspberry Pi

MQTT is a lightweight pub-sub framework that provides RabbitMQ-like
functionality on internet-connected microcontrollers like ESP8266.  Although
it's different from the AMQP protocol, RabbitMQ does have a MQTT plugin that
will allow MQTT clients to publish/subscribe to RabbitMQ.  This allows full
AMQP clients (like Raspberry Pi) to communicate with microcontrollers (like
ESP8266/Arduino) via RabbitMQ.

### Setting up the RabbitMQ Server

https://www.rabbitmq.com/mqtt.html

To install RabbitMQ on Rasperry Pi, first

```bash
apt-get install rabbitmq-server
rabbitmq-plugins enable rabbitmq_mqtt
service rabbitmq-server restart
```

then set up a new user (called `espuser`) we can use from our Arduino:

```bash
rabbitmqctl add_user espuser esppassword
rabbitmqctl set_permissions -p "/" espuser "^mqtt-subscription-ESP8266.*" ".*" ".*"
```

where `mqtt-subscription-XXXX` is the queue that is declared by the MQTT plugin
for RabbitMQ and `XXXX` is the clientID passed in as the first parameter to the
`client.connect()` routine in the [Arduino PubSubClient library].

```bash
rabbitmqctl add_user rpiuser rpipassword
rabbitmqctl set_permissions -p "/" rpiuser "^mqtt-subscription-ESP8266.*" ".*" ".*"
```

to connect, you would have to do (Arduino) `client.connect("ESP8266...", "espuser", "esppassword")`

Also add a user for the Raspberry Pi to use on the RabbitMQ user (called
`rpiuser`):

```bash
rabbitmqctl add_user rpiuser rpipassword
rabbitmqctl set_permissions -p "/" rpiuser "^mqtt-subscription-ESP8266.*" ".*" ".*"
```

### Connecting to RabbitMQ from Arduino

To connect to RabbitMQ from Arduino, you would issue something like

    client.connect("ESP8266...", "espuser", "esppassword")

Strangely, the `client.subscribe('XXX')` doesn't seem to do anything with
respect to `XXX`.  Haven't figured this out yet.

From the pub side, you really only need

```python
#!/usr/bin/env python
import pika
rmq_creds = pika.PlainCredentials('rpiuser', 'rpipassword')
rmq_conn_params = pika.ConnectionParameters('localhost', 5672, '/', rmq_creds)
conn = pika.BlockingConnection(rmq_conn_params)
channel = conn.channel()
channel.basic_publish(
  exchange='',
  routing_key='mqtt-subscription-ESP8266 Clientqos0',
  body='hello world')
conn.close()
```

That is, no need to declare any queues or exchanges, and use the default
exchange.  Note the routing key; in the Arduino sketch, we declare the MQTT
client id as `ESP8266 Client` and use the qos=0.  The RabbitMQ MQTT plugin then
crafts a queue named `mqtt-subscription-ESP8266 Clientqos0` based on this
information when the Arduino declares its subscription:

```java
Serial.print("Connecting to MQTT broker...");
if (client.connect("ESP8266 Client", mqtt_user, mqtt_password)) {
  Serial.println("connected");
  client.subscribe(mqtt_topic, 1);
} else {
  Serial.print("failed (");
  Serial.print(client.state());
  Serial.println(")");
}
```

### Unresolved Mysteries



### References

- https://www.rabbitmq.com/mqtt.html
- http://pubsubclient.knolleary.net/api.html
- https://www.baldengineer.com/mqtt-tutorial.html

- [Arduino PubSubClient library](https://pubsubclient.knolleary.net/)
