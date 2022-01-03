// IMPORTS
import  amqp from 'amqplib/callback_api.js';

class Subscriber{
    constructor() {
        this.amqp = amqp;
        this.queueName = 'dashBoardQueue';
        this.msg = '';
    }

    recieve(){
        this.amqp.connect(`amqp://localhost`,(err,connection)=>{
            if(err) throw err;
            connection.createChannel((err,channel)=> {
                if (err) throw err;
                channel.assertQueue(this.queueName,{
                    durable:false
                });
                channel.consume(this.queueName,(msg)=>{
                    this.msg = msg.content.toString();
                    channel.ack(msg);
                })

            });
        })
        return this.msg;
    }



}
export default Subscriber