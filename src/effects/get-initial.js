import React, {useEffect} from 'react';

export const getInitData = () => useEffect(function() {
    fetch('https://qrng.anu.edu.au/API/jsonI.php?length=10&type=uint8')
        .then(data => data.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => throw new Error(error.message));
}, []);
