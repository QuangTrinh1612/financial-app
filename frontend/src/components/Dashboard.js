import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import CryptoTable from './CryptoTable';
import CryptoChart from './CryptoChart';
import webSocketService from '../services/WebSocketService';

const Dashboard = () => {
    // State management
    const [state, setState] = useState({
        cryptoData: [],
        selectedCrypto: null,
        loading: true,
        error: null,
        connected: false
    });

    // Destructure state for cleaner access
    const { cryptoData, selectedCrypto, loading, error, connected } = state;

    // Helper function to update state partially
    const updateState = (newState) => {
        setState(prevState => ({ ...prevState, ...newState }));
    };

    // Update crypto data when new data arrives via WebSocket
    const updateCryptoData = useCallback((newData) => {
        setState(prevState => {
            const prevCryptoData = prevState.cryptoData;
            const index = prevCryptoData.findIndex(crypto => crypto.id === newData.id);

            let updatedCryptoData;
            if (index !== -1) {
                // Update existing crypto data
                updatedCryptoData = [...prevCryptoData];
                updatedCryptoData[index] = newData;
            } else {
                // Add new crypto data
                updatedCryptoData = [...prevCryptoData, newData];
            }

            // Also update selected crypto if it's the one that was updated
            const updatedSelectedCrypto =
                prevState.selectedCrypto && prevState.selectedCrypto.id === newData.id
                    ? newData
                    : prevState.selectedCrypto;

            return {
                ...prevState,
                cryptoData: updatedCryptoData,
                selectedCrypto: updatedSelectedCrypto
            };
        });
    }, []);

    // Handle fetching initial data
    const fetchInitialData = useCallback(async () => {
        try {
            const response = await axios.get('/api/crypto');
            const initialData = response.data;

            updateState({
                cryptoData: initialData,
                selectedCrypto: initialData.length > 0 ? initialData[0] : null,
                loading: false
            });
        } catch (err) {
            console.error('Error fetching crypto data:', err);
            updateState({
                error: 'Failed to load cryptocurrency data. Please try refreshing the page.',
                loading: false
            });
        }
    }, []);

    // Set up WebSocket connection
    const setupWebSocket = useCallback(() => {
        webSocketService.connect(() => {
            updateState({ connected: true });

            // Subscribe to all crypto updates
            webSocketService.subscribe('/topic/crypto', updateCryptoData);
        });
    }, [updateCryptoData]);

    // Initial setup on component mount
    useEffect(() => {
        fetchInitialData();
        setupWebSocket();

        // Cleanup on component unmount
        return () => {
            webSocketService.disconnect();
        };
    }, [fetchInitialData, setupWebSocket]);

    // Subscribe to selected crypto's specific topic
    useEffect(() => {
        if (selectedCrypto && connected) {
            const topicPath = `/topic/crypto/${selectedCrypto.symbol}`;

            // Subscribe to the specific crypto's updates
            webSocketService.subscribe(topicPath, (data) => {
                updateState({ selectedCrypto: data });
            });

            // Cleanup subscription when selected crypto changes
            return () => {
                webSocketService.unsubscribe(topicPath);
            };
        }
    }, [selectedCrypto, connected]);

    // Handle crypto selection from table
    const handleSelectCrypto = useCallback((crypto) => {
        updateState({ selectedCrypto: crypto });
    }, []);

    // Render loading state
    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status" className="mb-2" />
                <Alert variant="info">Loading cryptocurrency data...</Alert>
            </Container>
        );
    }

    // Render error state
    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Error Loading Data</Alert.Heading>
                    <p>{error}</p>
                    <button
                        className="btn btn-outline-primary mt-2"
                        onClick={fetchInitialData}
                    >
                        Retry
                    </button>
                </Alert>
            </Container>
        );
    }

    // Render the dashboard
    return (
        <Container fluid className="mt-4">
            <h1 className="text-center mb-4">Crypto Dashboard</h1>

            {/* Connection status indicator */}
            {!connected && (
                <Alert variant="warning" className="mb-3">
                    WebSocket disconnected. Real-time updates are not available.
                </Alert>
            )}

            <Row>
                {/* Left column - Chart */}
                <Col lg={8} className="mb-4">
                    <Card>
                        <Card.Header>
                            <h4>Price Chart</h4>
                        </Card.Header>
                        <Card.Body>
                            {selectedCrypto ? (
                                <CryptoChart
                                    data={selectedCrypto}
                                    symbol={selectedCrypto.symbol}
                                />
                            ) : (
                                <Alert variant="info">Select a cryptocurrency to view its chart</Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right column - Selected Crypto Details */}
                <Col lg={4} className="mb-4">
                    <Card>
                        <Card.Header>
                            <h4>Crypto Details</h4>
                        </Card.Header>
                        <Card.Body>
                            {selectedCrypto ? (
                                <div>
                                    <h2>{selectedCrypto.name} ({selectedCrypto.symbol})</h2>
                                    <h3 className="mb-3">${parseFloat(selectedCrypto.price).toFixed(2)}</h3>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span>24h Change:</span>
                                        <span className={parseFloat(selectedCrypto.changePercent24h) >= 0 ? 'text-success' : 'text-danger'}>
                                            {parseFloat(selectedCrypto.changePercent24h).toFixed(2)}%
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Market Cap:</span>
                                        <span>${parseFloat(selectedCrypto.marketCapUsd).toLocaleString()}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span>24h Volume:</span>
                                        <span>${parseFloat(selectedCrypto.volumeUsd24Hr).toLocaleString()}</span>
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <span>Last Updated:</span>
                                        <span>{new Date(selectedCrypto.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            ) : (
                                <Alert variant="info">Select a cryptocurrency to view details</Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Bottom - Crypto Table */}
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h4>Cryptocurrencies</h4>
                        </Card.Header>
                        <Card.Body>
                            <CryptoTable
                                cryptoData={cryptoData}
                                onSelectCrypto={handleSelectCrypto}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;