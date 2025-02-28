import React from 'react';
import { Container } from 'react-bootstrap';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="bg-dark text-white py-3">
                <Container>
                    <h1>Crypto Streaming Dashboard</h1>
                    <p className="mb-0">Real-time cryptocurrency data powered by Kafka and React</p>
                </Container>
            </header>

            <main>
                <Dashboard />
            </main>

            <footer className="bg-light text-center py-3 mt-5">
                <Container>
                    <p className="text-muted mb-0">
                        &copy; {new Date().getFullYear()} Crypto Stream App | Data provided by CoinCap API
                    </p>
                </Container>
            </footer>
        </div>
    );
}

export default App;