// IMPORTS
import  amqp from 'amqplib/callback_api.js';

class Publisher{

    constructor() {
        this.amqp = amqp;
        this.queueName = 'dashBoardQueue';
    }
    send(message){
        this.amqp.connect(`amqp://localhost`,(err,connection)=>{
            if(err) throw err;
            connection.createChannel((err,channel)=> {
                if (err) throw err;
                channel.assertQueue(this.queueName,{
                    durable:false
                });

                channel.sendToQueue(this.queueName,Buffer.from(message));
                setTimeout(()=>{
                    connection.close();
                },1000)

            });
        })
    }

}
export default Publisher