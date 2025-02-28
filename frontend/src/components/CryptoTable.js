import React from 'react';
import { Table, Badge } from 'react-bootstrap';

const CryptoTable = ({ cryptoData, onSelectCrypto }) => {
    // Sort data by market cap (descending)
    const sortedData = [...cryptoData].sort((a, b) =>
        parseFloat(b.marketCapUsd || 0) - parseFloat(a.marketCapUsd || 0)
    );

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const formatMarketCap = (marketCap) => {
        if (!marketCap) return 'N/A';
        const value = parseFloat(marketCap);
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return `$${value.toFixed(2)}`;
    };

    const formatChange = (change) => {
        if (!change) return <span>0.00%</span>;

        const changeValue = parseFloat(change);
        const color = changeValue >= 0 ? 'success' : 'danger';
        const prefix = changeValue >= 0 ? '+' : '';

        return (
            <Badge bg={color}>
                {prefix}{changeValue.toFixed(2)}%
            </Badge>
        );
    };

    return (
        <Table striped bordered hover responsive className="crypto-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>24h Change</th>
                    <th>Market Cap</th>
                </tr>
            </thead>
            <tbody>
                {sortedData.map((crypto, index) => (
                    <tr key={crypto.id} onClick={() => onSelectCrypto(crypto)} style={{ cursor: 'pointer' }}>
                        <td>{index + 1}</td>
                        <td>{crypto.name}</td>
                        <td>{crypto.symbol}</td>
                        <td>{formatPrice(crypto.price)}</td>
                        <td>{formatChange(crypto.changePercent24h)}</td>
                        <td>{formatMarketCap(crypto.marketCapUsd)}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default CryptoTable;