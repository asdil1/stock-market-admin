import {Controller, Get, Param} from '@nestjs/common';
import {StocksService} from "./stocks.service";

@Controller('stocks')
export class StocksController {

    constructor(private readonly stockService: StocksService) {}

    @Get()
    getStocks() {
        return this.stockService.getStocks();
    }
    @Get("/symbols")
    getAllDataStocks() {
        return this.stockService.getDataForAll();
    }

    @Get(":symbol")
    getDataForSymbol(@Param("symbol") symbol: string) {
        return this.stockService.getDataForSymbol(symbol);
    }
}
