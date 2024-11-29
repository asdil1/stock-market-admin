import {Injectable} from '@nestjs/common';
import {join} from "path";
import {cwd} from "process";
import {readFileSync, writeFileSync} from "fs";
import {StocksDto} from "./stocks.dto";


const STOCKS_FILE = join(cwd(), '/src/stocks/stocks.json');
const HISTORICAL_DATA = join(cwd(), '/src/stocks/historicalData.json');

@Injectable()
export class StocksService {

    private readStocks(): StocksDto[] {
        try {
            const data = readFileSync(STOCKS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    private readData() {
        try {
            const data = readFileSync(HISTORICAL_DATA, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    public getStocks() : StocksDto[] {
        return this.readStocks();
    };

    public getDataForSymbol(symbol: string){
        const data = this.readData();
        const dataForSymbol = data.filter(d => d.symbol === symbol);
        if (dataForSymbol) {
            return dataForSymbol;
        }
    }

    public getDataForAll(){
        return this.readData();
    }
}
