import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {BrokersService} from "./brokers.service";
import {BrokerDto} from "./broker.dto";
import {WebSocketService} from "../websocket-service/websocket.service";

@Controller('brokers')
export class BrokersController {

    constructor(
        private readonly service: BrokersService,
        private readonly webSocketService: WebSocketService,
    ) {}

    @Get()
    getAllBrokers(){
        return this.service.getBrokers();
    }

    @Post()
    registerBroker(@Body() brokerData: BrokerDto){
        return this.service.addBroker(brokerData);
    }

    @Delete(':id')
    deleteBroker(@Param('id') id: string){
        return this.service.deleteBroker(id);
    }

    @Put(':id')
    editBrokerFunds(@Param('id') id: string, @Body() brokerFunds: any){
        const brokers =  this.service.editBrokerFunds(id, brokerFunds);
        const updatedBroker = brokers.find(broker => broker.id === parseInt(id));
        this.webSocketService.broadcastBrokerData(updatedBroker);
        return brokers;
    }

    @Put('/buy/:id')
    boughtStocks(@Param('id') id: string, @Body() broker: BrokerDto){
        const updatedBroker = this.service.boughtStocks(id, broker);
        this.webSocketService.broadcastBrokerData(updatedBroker);
        return updatedBroker;
    }
}
