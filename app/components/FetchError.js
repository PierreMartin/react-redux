import React from 'react';

const FetchError = ({ message, onRetry }) => (
    <div>
        <p>something went wrong from server... {message}</p>
        <button onClick={onRetry}>Retry</button>
    </div>
);

export default FetchError;