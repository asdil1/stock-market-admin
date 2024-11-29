import React, {useState, useEffect, useRef} from "react";
import { io, Socket } from 'socket.io-client';
import {useSelector} from "react-redux";
import {RootState} from "../store/store";

interface PriceUpdate {
    symbol: string;
    price: number;
}


const TradingComponent : React.FC = () => {
    const socketRef = useRef<Socket | null>(null);

    const [currentPrices, setCurrentPrices] = useState<PriceUpdate[]>([]);
    const [currentDate, setCurrentDate] = useState("");

    const [startDate, setStartDate] = useState("");
    const [refreshInterval, setRefreshInterval] = useState(0);

    // Получаем массив выбранных акций из хранилища Redux
    const selectedStocks = useSelector((state: RootState) => state.stock.selectedStocks);

    useEffect(() => {
        // Подключаемся к WebSocket серверу только один раз
        socketRef.current = io('http://localhost:3000');

        // Обработчик для получения обновленных данных торгов
        socketRef.current.on('priceUpdate', (data) => {
            console.log('Получены обновления:', data);

            setCurrentPrices(data.prices);
            setCurrentDate(data.date);
        });

        socketRef.current.on('newSettings', (data) => {
            alert(data.message);
        });

        // Закрываем соединение при размонтировании компонента
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    const handleStartTrading = () => {
        socketRef.current?.emit('startTrading', { selectedStocks, startDate, refreshInterval });
        alert("Имитация торговли началась");
    }

    const handleStopTrading = () => {
        socketRef.current?.emit('stopTrading');
        alert("Имитация завершена");
    }

    return (
        <div>
            <h2>Имитация торговли</h2>
            <div className="settings">
                <label htmlFor="date-trading">Дата начала торгов</label>
                <input
                    id="date-trading"
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label htmlFor="time-refresh">Обновление данных в секундах</label>
                <input
                    id="time-refresh"
                    type="number"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                />
                <button className="start-trading" onClick={handleStartTrading}>Начало торгов</button>
                <button className="stop-trading" onClick={handleStopTrading}>Конец торгов</button>
            </div>
            <div>
                <ul>
                    {currentPrices.map((price, index) => (
                        <li key={index}>
                            <p>Акция: {price.symbol}</p>
                            <p>Цена: {price.price}</p>
                            <p>Дата: {currentDate}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TradingComponent;