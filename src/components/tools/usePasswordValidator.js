import { useState, useEffect } from 'react';

// Custom Hook pour gérer et valider les mots de passe
const usePasswordValidation = (password) => {
  const criteria = [
    { label: '8 caractères', test: (pw) => pw.length >= 8 },
    { label: 'une majuscule', test: (pw) => /[A-Z]/.test(pw) },
    { label: 'un chiffre', test: (pw) => /\d/.test(pw) },
    { label: 'un caractère spécial', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
  ];

  const [criteriaResults, setCriteriaResults] = useState(
    criteria.map(criterion => ({ label: criterion.label, passed: false }))
  );
  
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const results = criteria.map(criterion => ({
      label: criterion.label,
      passed: criterion.test(password),
    }));
    setCriteriaResults(results);
    setIsValid(results.every(result => result.passed));
  }, [password]);

  return { criteriaResults, isValid };
};

export default usePasswordValidation;
