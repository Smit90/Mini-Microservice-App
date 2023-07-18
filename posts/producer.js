const amqp = require("amqplib");
const config = require("../config/rabbitMQ-config");

class Producer {
    channel;

    async createChannel() {
        const connection = await amqp.connect(config.rabbitMQ.url);
        this.channel = await connection.createChannel();
    }

    async publishMessage(routingKey, data) {
        if (!this.channel) {
            await this.createChannel();
        }
        const exchangeName = config.rabbitMQ.exchangeName;
        await this.channel.assertExchange(exchangeName, "direct");

        const logDetails = {
            logType: routingKey,
            data: data,
            dateTime: new Date(),
        };
        await this.channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(logDetails))
        );

        console.log(
            `The new ${routingKey} log is sent to exchange ${exchangeName}`
        );
    }
}

module.exports = Producer;
