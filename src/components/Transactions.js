import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_TRANSACTIONS = gql`
  query GetTransactions {
    allTransactions {
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

const Transactions = () => {
  const { loading, error, data } = useQuery(GET_TRANSACTIONS);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {data.allTransactions.map((transaction) => (
          <li key={transaction.id}>
            <strong>ID Transaction:</strong> {transaction.id}<br />
            <strong>Montant:</strong> {transaction.montant}<br />
            <strong>Date de transaction:</strong> {transaction.dateTransaction}<br />
            <strong>Type:</strong> {transaction.type}<br />
            <strong>Compte ID:</strong> {transaction.compte.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
