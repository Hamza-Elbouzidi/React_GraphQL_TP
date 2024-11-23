import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

// Définir la mutation GraphQL pour ajouter un compte
const AJOUTER_COMPTE = gql`
  mutation AjouterCompte($compteInput: CompteInput!) {
    saveCompte(compteInput: $compteInput) {
      id
      solde
      dateCreation
      type
    }
  }
`;

const AjouterCompte = () => {
  const [solde, setSolde] = useState('');
  const [dateCreation, setDateCreation] = useState('');
  const [type, setType] = useState('COURANT');

  const [ajouterCompte, { loading, error }] = useMutation(AJOUTER_COMPTE);

  const handleSubmit = (e) => {
    e.preventDefault();

    const dateFormatted = new Date(dateCreation).toISOString().split('T')[0]; // Format yyyy-MM-dd

    ajouterCompte({
      variables: {
        compteInput: { solde: parseFloat(solde), dateCreation: dateFormatted, type },
      },
    });
  };

  if (loading) return <p>Ajout du compte...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <div>
      <h2>Ajouter un compte</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Solde"
          value={solde}
          onChange={(e) => setSolde(e.target.value)}
        />
        <input
          type="date"
          placeholder="Date de création"
          value={dateCreation}
          onChange={(e) => setDateCreation(e.target.value)}
        />
        <select onChange={(e) => setType(e.target.value)} value={type}>
          <option value="COURANT">Courant</option>
          <option value="EPARGNE">Épargne</option>
        </select>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AjouterCompte;
