import React, {useState, useEffect} from "react";


interface Broker {
    id: number;
    name: string;
    funds: number;
}


const BrokerList: React.FC = () => {
    const [brokers, setBrokers] = useState<Broker[]>([]);
    const [brokerName, setBrokerName] = useState("");
    const [initialFunds, setInitialFunds] = useState(0);

    const [nameError, setNameError] = useState("");
    const [fundsError, setFundsError] = useState("");

    const [editingBrokerId, setEditingBrokerId] = useState<number | null>(null);
    const [editedFunds, setEditedFunds] = useState<number | null>(null);

    // Загружаем список брокеров
    useEffect(() => {
        fetch('http://localhost:3000/brokers')
            .then(response => response.json())
            .then(data => setBrokers(data))
            .catch(error => console.log("Ошибка при загрузке брокеров: ", error));
    }, []);

    // Функция добавления брокера
    const handleAddBroker = () => {
        let isValid = true;

        if(brokerName === ""){
            setNameError("Поле 'Имя брокера' должно быть заполнено.");
            isValid = false;
        } else {
            setNameError("");
        }

        if (initialFunds <= 0){
            setFundsError("Поле 'Баланс' должно быть больше 0.");
            isValid = false;
        } else {
            setFundsError("");
        }

        if(!isValid) return;

        fetch('http://localhost:3000/brokers', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: brokerName, funds: initialFunds}),
        })
            .then(response => response.json())
            .then(newBroker => {
                setBrokers([...brokers, newBroker]);
                setBrokerName("");
                setInitialFunds(0);
            })
            .catch(error => console.error("Ошибка при добавлении брокера: ", error));
    };

    // Функция удаления брокера
    const handleDeleteBroker = (id: number) => {
        fetch(`http://localhost:3000/brokers/${id}`, {
            method: 'DELETE',
        })
            .then(() => setBrokers(brokers.filter(broker => broker.id !== id)))
            .catch(error => console.error("Ошибка при удалении брокера: ", error));
    };

    // Функция обновления баланса
    const handleSaveFunds = (id: number) => {
        fetch(`http://localhost:3000/brokers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({funds: editedFunds}),
        })
            .then((response) => response.json())
            .then(data => {
                setBrokers(data)
                setEditingBrokerId(null);
                setEditedFunds(null);
            })
            .catch(error => console.error("Ошибка при обновлении брокера: ", error));
    };

    const handleEditFunds = (broker: Broker) => {
        setEditingBrokerId(broker.id);
        setEditedFunds(broker.funds);
    };

    const brokerElement = (broker: Broker) => {
        return(
            <li key={broker.id}>
                <div className="brokers">
                    <label>Имя брокера:</label>
                    {broker.name}
                    <label>Баланс брокера:</label>
                    {editingBrokerId === broker.id ? (
                        <div>
                            <input
                                type="number"
                                value={editedFunds ?? broker.funds}
                                onChange={(e) => setEditedFunds(parseInt(e.target.value))}
                            />
                            <button className="edit-broker" onClick={() => handleSaveFunds(broker.id)}>
                                Сохранить
                            </button>
                        </div>
                    ) : (
                        <div>
                            <span onClick={() => handleEditFunds(broker)}>
                                {broker.funds}
                            </span>
                            <button className="delete-broker" onClick={() => handleDeleteBroker(broker.id)}>
                                Удалить
                            </button>
                        </div>
                    )}
                </div>
            </li>
        );
    };

    return (
        <div>
            <h1>Брокеры</h1>
            <ul className="brokers-group">
                {brokers.map((broker) => (
                    brokerElement(broker)
                ))}
            </ul>
            <div>
                <h2>Добавить Брокера</h2>
                <div className="form-group">
                    <label htmlFor="broker-name">Имя брокера</label>
                    <input
                        id="broker-name"
                        type="text"
                        placeholder="Имя брокера"
                        value={brokerName}
                        onChange={(e) => setBrokerName(e.target.value)}
                        required
                    />
                    {nameError && <span className="error-message">{nameError}</span>}
                    <label htmlFor="broker-balance">Баланс брокера</label>
                    <input
                        id="broker-balance"
                        type="number"
                        value={initialFunds}
                        onChange={(e) => setInitialFunds(parseInt(e.target.value))}
                        required
                    />
                    {fundsError && <span className="error-message">{fundsError}</span>}
                    <button className="add-broker" onClick={handleAddBroker}>Добавить</button>
                </div>
            </div>
        </div>
    );
}

export default BrokerList;