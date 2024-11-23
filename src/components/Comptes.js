import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

// Requête pour obtenir tous les comptes
const GET_ALL_COMPTES = gql`
  query GetAllComptes {
    allComptes {
      id
      solde
      dateCreation
      type
    }
  }
`;

// Requête pour obtenir les comptes par ID
const GET_COMPTE_BY_ID = gql`
  query GetCompteById($id: ID!) {
    compteById(id: $id) {
      id
      solde
      dateCreation
      type
    }
  }
`;

// Requête pour obtenir les comptes par type
const GET_COMPTES_BY_TYPE = gql`
  query GetComptesByType($type: TypeCompte!) {
    comptesByType(type: $type) {
      id
      solde
      dateCreation
      type
    }
  }
`;

// Requête pour obtenir les transactions d'un compte
const GET_TRANSACTIONS_BY_COMPTE = gql`
  query GetTransactionsByCompte($compteId: ID!) {
    transactionsByCompte(compteId: $compteId) {
      id
      montant
      type
      dateTransaction
      description
    }
  }
`;

const Comptes = () => {
  // États pour gérer les filtres et les résultats
  const [id, setId] = useState('');
  const [type, setType] = useState('');
  const [selectedCompteId, setSelectedCompteId] = useState(null); // État pour le compte sélectionné

  // Requête pour obtenir tous les comptes ou appliquer les filtres
  const { loading, error, data } = useQuery(
    id ? GET_COMPTE_BY_ID : type ? GET_COMPTES_BY_TYPE : GET_ALL_COMPTES,
    {
      variables: id ? { id } : type ? { type } : {}, // Applique les variables de filtre si elles sont définies
      skip: !id && !type, // Si aucun filtre n'est défini, on envoie la requête GET_ALL_COMPTES
    }
  );

  // Gérer les changements de filtre
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setType(value);
      setId(''); // Réinitialiser l'ID lorsque le type est modifié
    } else if (name === 'id') {
      setId(value);
      setType(''); // Réinitialiser le type lorsque l'ID est modifié
    }
  };

  // Récupérer les transactions du compte sélectionné
  const { loading: transactionsLoading, data: transactionsData } = useQuery(
    GET_TRANSACTIONS_BY_COMPTE,
    {
      variables: { compteId: selectedCompteId },
      skip: !selectedCompteId, // Exécute la requête uniquement si un compte est sélectionné
    }
  );

  // Fonction pour gérer le clic sur un compte et afficher ses transactions
  const handleCompteClick = (compteId) => {
    setSelectedCompteId(compteId); // Sélectionne le compte et charge ses transactions
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  // Récupérer les comptes à afficher en fonction des filtres
  const comptesToDisplay = data ? (data.compteById || data.comptesByType || data.allComptes) : [];

  return (
    <div>
      <h2>Liste des Comptes</h2>
      <ul>
        {comptesToDisplay.length > 0 ? (
          comptesToDisplay.map((compte) => (
            <li key={compte.id}>
              <strong>ID:</strong> {compte.id}<br />
              <strong>Solde:</strong> {compte.solde}<br />
              <strong>Date de création:</strong> {compte.dateCreation}<br />
              <strong>Type:</strong> {compte.type}
              <button onClick={() => handleCompteClick(compte.id)}>
                Voir Transactions
              </button>
            </li>
          ))
        ) : (
          <p>Aucun compte trouvé.</p>
        )}
      </ul>

      <h3>Filtrer les Comptes</h3>
      <form>
        {/* Sélecteur de type */}
        <select name="type" onChange={handleFilterChange} value={type}>
          <option value="">Tous les types</option>
          <option value="COURANT">Courant</option>
          <option value="EPARGNE">Épargne</option>
        </select>

        {/* Champ de filtrage par ID */}
        <input
          type="text"
          name="id"
          placeholder="ID du compte"
          value={id}
          onChange={handleFilterChange}
        />
      </form>

      {selectedCompteId && transactionsLoading ? (
        <p>Chargement des transactions...</p>
      ) : transactionsData ? (
        <div>
          <h3>Transactions du compte {selectedCompteId}</h3>
          <ul>
            {transactionsData.transactionsByCompte.length > 0 ? (
              transactionsData.transactionsByCompte.map((transaction) => (
                <li key={transaction.id}>
                  <strong>Montant:</strong> {transaction.montant}<br />
                  <strong>Type:</strong> {transaction.type}<br />
                  <strong>Date:</strong> {transaction.dateTransaction}<br />
                  <strong>Description:</strong> {transaction.description}
                </li>
              ))
            ) : (
              <p>Aucune transaction trouvée.</p>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default Comptes;
