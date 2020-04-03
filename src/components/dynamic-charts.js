import React, { useEffect, useState } from 'react';
import {LineChart, XAxis, YAxis, CartesianGrid, Line} from 'recharts';

const INITIAL_ITEMS_NUMBER = 10;
const GET_INIT_DATA_URL = `https://qrng.anu.edu.au/API/jsonI.php?length=${INITIAL_ITEMS_NUMBER}&type=uint8`;
const GET_UPDATED_ITEM_DATA_URL = 'https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8';

function normalizeChartData(dataArray) {
    const dataBoilerplate =  new Array(dataArray[0].data.length).fill({}).map((item, idx) => ({ name: `item-${idx}` }));
    const normalizedData = dataArray.reduce((acc, dataItemArray) => {
        dataItemArray.data.forEach((item, index) => {
            acc[index][dataItemArray.label] = item;
        });

        return acc;
    }, dataBoilerplate);

    return normalizedData;
}

function DynamicCharts() {
    const [normalizedData, setNormalizedData] = useState([]);
    const [itemToAdd, setItemToAdd] = useState();

    useEffect(async function() {
        Promise.all([
            fetch(GET_INIT_DATA_URL)
                .then(data => data.json())
                .then(data => {
                    return { data: data.data, label: 'ua' };
                })
                .catch(error => console.error(error.message || error)),
            fetch(GET_INIT_DATA_URL)
                .then(data => data.json())
                .then(data => {
                    return { data: data.data, label: 'us' };
                })
                .catch(error => console.error(error.message || error))
            ]).then((data) => {
                setNormalizedData(normalizeChartData(data));
            });
    }, []);

    useEffect(() => {
        let counter = INITIAL_ITEMS_NUMBER;
        const interval = setInterval(() => {
            counter += 1;
            Promise.all([
                fetch(GET_UPDATED_ITEM_DATA_URL)
                    .then(data => data.json())
                    .then(data => {
                        return { data: data.data, label: 'ua' };
                    })
                    .catch(error => console.error(error.message || error)),
                fetch(GET_UPDATED_ITEM_DATA_URL)
                    .then(data => data.json())
                    .then(data => {
                        return { data: data.data, label: 'us' };
                    })
                    .catch(error => console.error(error.message || error))
            ]).then((data) => {
                const itemToAdd = data.reduce((acc, dataItem) => {
                    acc[dataItem.label] = dataItem.data[0];
                    return acc;
                }, {name: `item-${counter}`});
                setItemToAdd(itemToAdd);
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const dataToUpdate = [...normalizedData];
        dataToUpdate.shift();
        dataToUpdate.push(itemToAdd);

        setNormalizedData(dataToUpdate);
    }, [itemToAdd]);

    return (
        <section>
            <LineChart width={500} height={300} data={normalizedData}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                <Line type="monotone" dataKey="us" stroke="#8884d8" />
                <Line type="monotone" dataKey="ua" stroke="#82ca9d" />
            </LineChart>
        </section>
    );
}

export default DynamicCharts;