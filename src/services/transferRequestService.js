import { seihFetch } from "./seihApi";

/* ============================= */
/* CREATE TRANSFER REQUEST */
/* ============================= */

export async function createTransferRequest(data) {
  const res = await seihFetch("/dme/transfer-request/create", {
    method: "POST",
    body: data,
  });

  const json = await res.json();

  if (!res.ok || json.isError) {
    throw new Error("Erreur création demande transfert");
  }

  return json;
}

/* ============================= */
/* LIST REQUESTS */
/* ============================= */

export async function listTransferRequests(data) {
  const res = await seihFetch("/dme/transfer-request/list", {
    method: "POST",
    body: data,
  });

  const json = await res.json();

  if (!res.ok || json.isError) {
    throw new Error("Erreur récupération demandes");
  }

  return json;
}

/* ============================= */
/* RESPOND REQUEST */
/* ============================= */

export async function respondTransferRequest(data) {
  const res = await seihFetch("/dme/transfer-request/respond", {
    method: "POST",
    body: data,
  });

  const json = await res.json();

  if (!res.ok || json.isError) {
    throw new Error("Erreur réponse demande");
  }

  return json;
}