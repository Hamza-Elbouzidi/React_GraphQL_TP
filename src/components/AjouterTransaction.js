import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const AJOUTER_TRANSACTION = gql`
  mutation AjouterTransaction($transaction: TransactionInput!) {
    addTransaction(transaction: $transaction) {
      id
      montant
      dateTransaction
      type
      compte {
        id
      }
    }
  }
`;

const AjouterTransaction = () => {
  const [compteId, setCompteId] = useState('');
  const [montant, setMontant] = useState('');
  const [type, setType] = useState('DEPOT');
  const [description, setDescription] = useState('');

  const [ajouterTransaction, { loading, error }] = useMutation(AJOUTER_TRANSACTION);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (compteId && montant) {
      ajouterTransaction({
        variables: {
          transaction: {
            montant: parseFloat(montant),
            type,
            compteId,
            description,
          },
        },
      });
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  };

  if (loading) return <p>Ajout de la transaction...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <div>
      <h2>Ajouter une transaction</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Compte ID"
          value={compteId}
          onChange={(e) => setCompteId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Montant"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
        />
        <select onChange={(e) => setType(e.target.value)} value={type}>
          <option value="DEPOT">Dépôt</option>
          <option value="RETRAIT">Retrait</option>
          <option value="TRANSFERT">Transfert</option>
        </select>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AjouterTransaction;
