// src/services/formService.js

const STORAGE_KEY = "created_forms";

export function getForms() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addForm(form) {
  const forms = getForms();
  forms.push(form);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
}

export function deleteForm(id) {
  const forms = getForms().filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
}

export function clearForms() {
  localStorage.removeItem(STORAGE_KEY);
}
