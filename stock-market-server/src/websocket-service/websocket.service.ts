import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import {readFileSync, writeFileSync} from "fs";
import {join} from "path";
import {cwd} from "process";


const HISTORICAL_DATA = join(cwd(), '/src/stocks/historicalData.json');


@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class WebSocketService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private priceUpdateInterval: NodeJS.Timeout | null = null;

    afterInit() {
        console.log('Websocket server initialized');
    }

    handleConnection(client: any) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: any) {
        console.log(`Client disconnected: ${client.id}`);
    }

    private readData() {
        try {
            const data = readFileSync(HISTORICAL_DATA, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error(err);
            return [];
        }
    };


    private writeData(data) {
        writeFileSync(HISTORICAL_DATA, JSON.stringify(data, null, 2));
    }

    private updateStockPrice(symbol: string, startDate: string) {
        let stocksData = this.readData();

        // Ищем последнее вхождение акции
        const lastEntry = stocksData
            .filter(stock => stock.symbol === symbol)
            .sort((a: {date: string}, b: {date: string}) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        const lastPrice = parseFloat(lastEntry.price);
        const change = (Math.random() - 0.5) * 2 * 0.01 * lastPrice;
        const newPrice = (lastPrice + change).toFixed(2);

        const newEntry = {
            symbol,
            date: startDate,
            price: newPrice,
        };
        stocksData.push(newEntry);
        this.writeData(stocksData);
        return newEntry;
    }

    private generatePriceUpdates(selectedStocks: string[], startDate: string) {
        return selectedStocks.map(stock => (
            this.updateStockPrice(stock, startDate)
        ));
    }

    @SubscribeMessage('startTrading')
    handleStartTrading(@MessageBody() data: { selectedStocks: string[], startDate: string, refreshInterval: number }) {
        if (this.priceUpdateInterval) {
            clearInterval(this.priceUpdateInterval);
            this.server.emit('newSettings', {
                message: "Настройки обновлены: " +
                    "интервал: " + data.refreshInterval + ", " +
                    "дата: " + data.startDate + ", " +
                    "список акций: " + data.selectedStocks
            });
        }

        this.priceUpdateInterval = setInterval(() => {
            const currentPrices = this.generatePriceUpdates(data.selectedStocks, data.startDate);
            const date = data.startDate;

            this.server.emit('priceUpdate', { prices: currentPrices, date});

        }, data.refreshInterval * 1000);
    }

    @SubscribeMessage('stopTrading')
    handleStopTrading() {
        if (this.priceUpdateInterval) {
            clearInterval(this.priceUpdateInterval);
            this.priceUpdateInterval = null;
            console.log('Торговля остановлена');
        }
    }

    broadcastBrokerData(updatedBroker){
        this.server.emit('brokerUpdate', updatedBroker);
    }
}
