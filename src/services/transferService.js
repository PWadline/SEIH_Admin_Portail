import { seihFetch } from "./seihApi";

export async function createTransfer(payload) {

  const res = await seihFetch("/dme/transfer/create", {
    method: "POST",
    body: payload
  });

  if (!res.ok) {
    throw new Error("Erreur transfert");
  }

  const data = await res.json().catch(() => true);

  return data;
}

export async function getTransfers() {
  const res = await seihFetch("/dme/transfers/list", {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Erreur récupération transferts");
  }

  const data = await res.json();

  return data.result; // ⚠️ important
}