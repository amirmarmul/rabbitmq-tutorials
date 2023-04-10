#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error1;
  }

  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }


    var my_exchange = 'delayed';
    channel.assertExchange(my_exchange, 'topic', { durable: true });

    var primary_queue = 'queue.default';
    channel.assertQueue(primary_queue, { durable: true });
    channel.bindQueue(primary_queue, my_exchange, 'default');

    var waiting_queue = 'queue.waiting';
    channel.assertQueue(waiting_queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': my_exchange,
        'x-dead-letter-routing-key': 'default',
      }
    });

    var msg = process.argv.slice(2).join(' ') || 'Hello World!';
    var secs = msg.toString().split('.').length - 1 || 0;

    channel.sendToQueue(waiting_queue, Buffer.from(msg), {
      persistent: true,
      expiration: secs * 1000,
    });

    console.log(' [x] Sent %s', msg);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
