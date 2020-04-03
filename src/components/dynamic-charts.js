import React, { useEffect, useState } from 'react';
import {LineChart, XAxis, YAxis, CartesianGrid, Line} from 'recharts';

const INITIAL_ITEMS_NUMBER = 10;
const getDataLink = items => `https://qrng.anu.edu.au/API/jsonI.php?length=${items}&type=uint8`;

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

async function fetchData(itemsNumber, label) {
    let data;
    try {
        data = await fetch(getDataLink(itemsNumber))
            .then(data => data.json());
    } catch (e) {
        console.error(e.message || e)
    }

    return { data: data.data, label };
}

function DynamicCharts({ checkboxState }) {
    const [normalizedData, setNormalizedData] = useState([]);
    const [itemToAdd, setItemToAdd] = useState();
    const keysToFetch = Object.keys(checkboxState).filter(item => checkboxState[item]);

    useEffect(  () => {
        (async function fetchAll() {
            const data = await Promise.all(keysToFetch.map(label => fetchData(INITIAL_ITEMS_NUMBER, label)));
            return setNormalizedData(normalizeChartData(data));
        })();
    }, []);

    useEffect( () => {
        let counter = INITIAL_ITEMS_NUMBER;
        const interval = setInterval(async () => {
            counter += 1;

            const data = await Promise.all(keysToFetch.map(label => fetchData(1, label)));
            const itemToAdd = data.reduce((acc, dataItem) => {
                acc[dataItem.label] = dataItem.data[0];
                return acc;
            }, {name: `item-${counter}`});
            setItemToAdd(itemToAdd);
        }, 1000);
        return () => clearInterval(interval);
    }, [checkboxState]);

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
                {
                    Object.keys(checkboxState).map(item => (
                        checkboxState[item] && <Line type="monotone" dataKey={item} stroke="#8884d8" />
                    ))
                }
            </LineChart>
        </section>
    );
}

export default DynamicCharts;