import { Injectable } from '@nestjs/common';
import { BrokerDto } from './broker.dto';
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";

const BROKERS_FILE = join(cwd(), '/src/brokers/brokers.json');

@Injectable()
export class BrokersService {

    private readBrokers(): BrokerDto[] {
        try {
            const data = readFileSync(BROKERS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    private writeBrokers(brokers: BrokerDto[]) {
        writeFileSync(BROKERS_FILE, JSON.stringify(brokers, null, 2));
    }

    public getBrokers(): BrokerDto[] {
        return this.readBrokers();
    }

    public addBroker(broker: BrokerDto){
        const brokers = this.readBrokers();
        const lastBroker = brokers.at(-1);
        let lastId = lastBroker.id;
        broker.id = lastId + 1;
        brokers.push(broker);
        this.writeBrokers(brokers);
        return broker;
    }

    public deleteBroker(id: string){
        let brokers = this.readBrokers();
        const brokerIndex = brokers.findIndex(broker => broker.id === parseInt(id));
        if (brokerIndex !== -1) {
            brokers.splice(brokerIndex, 1);
            this.writeBrokers(brokers);
            return { message: 'Broker deleted successfully'};
        } else {
            return { message: 'Broker not found.' };
        }
    }

    public editBrokerFunds(id: string, brokerFunds: any){
        let brokers = this.readBrokers();
        console.log(brokerFunds);
        let brokerIndex = brokers.findIndex(broker => broker.id === parseInt(id));
        if (brokerIndex !== -1){
            brokers[brokerIndex].funds = brokerFunds.funds;
            this.writeBrokers(brokers);
            return brokers;
        }
    }

    public boughtStocks(id: string, broker: BrokerDto){
        let brokers = this.readBrokers();
        let brokerIndex = brokers.findIndex(broker => broker.id === parseInt(id));
        if (brokerIndex !== -1){
            brokers[brokerIndex] = broker;
            this.writeBrokers(brokers);
            return brokers[brokerIndex];
        } else {
            return { message: 'Broker not found.' }
        }
    }
}
