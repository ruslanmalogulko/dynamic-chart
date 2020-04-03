import React, {useState} from 'react';
import './App.css';

import DynamicCharts from "./components/dynamic-charts";
import SelectControl from "./components/select-control";

const NAMES = ['us', 'ua'];

function App() {
    const [checkboxState, setCheckboxState] = useState({[NAMES[0]]: true, [NAMES[1]]: true});

    function onSelectChange(name) {
        const state = {...checkboxState};

        state[name] = !state[name];
        setCheckboxState(state);
    }
    return (
        <div className="App">
            <h2>
                Dynamic Charts
            </h2>
            <DynamicCharts checkboxState={checkboxState}/>
            <SelectControl checkboxState={checkboxState} onChange={onSelectChange} names={NAMES}/>
        </div>
    );
}

export default App;
