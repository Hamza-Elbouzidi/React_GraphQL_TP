import React from 'react';
import Comptes from './components/Comptes';
import Transactions from './components/Transactions';
import AjouterCompte from './components/AjouterCompte';
import AjouterTransaction from './components/AjouterTransaction';
import './App.css';

function App() {
  return (
    <div>
      <h1>Gestion des Comptes et Transactions</h1>
      <AjouterCompte />
      <AjouterTransaction />
      <Comptes />
      <Transactions />
    </div>
  );
}

export default App;
