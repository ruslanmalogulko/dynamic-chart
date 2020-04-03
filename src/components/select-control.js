import React from 'react';

function SelectControl ({ onChange, names, checkboxState }) {
    return (
        <section>
            {names.map(name => (
                <label key={name}>
                    <h2>{name}</h2>
                    <input key={name} type="checkbox" name={name} id={name} checked={checkboxState[name]} onChange={() => onChange(name)} />
                </label>
            ))}
        </section>
    );
};
SelectControl.defaultProps = {
    names: [],
    onChange: () => {}
};

export default SelectControl;