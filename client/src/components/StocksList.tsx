import React, {useState, useEffect, useRef} from "react";
import Modal from "./HistoricalDataModal";
import {useDispatch, useSelector} from "react-redux";
import {RootState, AppDispatch} from "../store/store";
import {toggleStock} from "../store/slices/selectedStocksSlice";

import { io, Socket } from 'socket.io-client';

interface Stock {
    symbol: string;
    name: string;
}

const StocksList: React.FC = () => {
    const socketRef = useRef<Socket | null>(null);

    const [stocks, setStocks] = useState<Stock[]>([]);

    const dispatch: AppDispatch = useDispatch();
    const selectedStocks = useSelector((state: RootState) => state.stock.selectedStocks);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedStockSymbol, setSelectedStockSymbol] = useState("");

    const [historicalData, setHistoricalData] = useState<{ symbol: string, date: string, price: string}[] | null>(null);


    useEffect(() => {
        fetch('http://localhost:3000/stocks')
            .then(res => res.json())
            .then(data => setStocks(data))
            .catch(error => console.log("Ошибка загрузки акций: ", error));


        // слушаем обновление цен для графика подключаемся один раз
        socketRef.current = io('http://localhost:3000');

        socketRef.current.on('priceUpdate', (data) => {
            console.log('Получены обновления для графика:', data);
            setHistoricalData((prevData) => [...(prevData || []), ...data.prices]);
        })

        return () => {
            socketRef.current?.disconnect();
        }

    }, []);

    const handleSelectStock = (symbol : string) => {
        dispatch(toggleStock(symbol));
    };

    const handleViewHistoricalData = (symbol : string) => {
        fetch(`http://localhost:3000/stocks/${symbol}`)
            .then(res => res.json())
            .then(data => {

                const sortedData = data.sort((a: {date: string}, b: {date: string}) => {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                });
                setHistoricalData(sortedData);
            })
            .catch(error => console.log("Ошибка загрузки цен: ", error));
        setSelectedStockSymbol(symbol);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false); // Закрываем модальное окно
        setHistoricalData(null);
    };

    return (
        <div>
            <h1>Список доступных акций</h1>
            <ul>
                {stocks.map((stock) => (
                    <li className="stocks-list" key={stock.symbol}>
                        <input
                            type="checkbox"
                            checked={selectedStocks.includes(stock.symbol)}
                            onChange={() => handleSelectStock(stock.symbol)}
                        />
                        <label>{stock.name} ({stock.symbol})</label>
                        <button className="check-data" onClick={() => handleViewHistoricalData(stock.symbol)}>
                            Просмотреть исторические данные
                        </button>
                    </li>
                ))}
            </ul>
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={`Исторические данные для ${selectedStockSymbol}`}
                historicalData={historicalData?.filter((item) => item.symbol === selectedStockSymbol) || null}
            />
        </div>
    );
}

export default StocksList;