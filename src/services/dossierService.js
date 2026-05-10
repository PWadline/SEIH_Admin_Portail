const STORAGE_KEY = "dossiers";

/**
 * Récupère la liste des dossiers depuis localStorage.
 * Si vide, renvoie un tableau vide.
 */
export const getDossiers = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Ajoute un nouveau dossier à la liste et sauvegarde dans localStorage.
 */
export const addDossier = (dossier) => {
  const dossiers = getDossiers();
  dossiers.push(dossier);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dossiers));
};

/**
 * Met à jour un dossier existant par son id.
 */
export const updateDossier = (updatedDossier) => {
  const dossiers = getDossiers();
  const index = dossiers.findIndex((d) => d.id === updatedDossier.id);
  if (index !== -1) {
    dossiers[index] = updatedDossier;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dossiers));
  }
};

/**
 * Supprime un dossier par son id.
 */
export const deleteDossier = (id) => {
  const dossiers = getDossiers().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dossiers));
};
