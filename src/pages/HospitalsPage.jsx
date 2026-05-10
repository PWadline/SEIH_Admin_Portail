import { useEffect, useState } from "react";
import Table from "../components/common/Table";
import ModalViewCompte from "../components/modal/ModalViewCompte";

/** ====== CONFIG & HELPERS (token en mémoire + refresh automatique) ====== */
const BASE = (
  import.meta.env.VITE_BASE_API_URL || "https://localhost:5258"
).replace(/\/$/, "");

// Tente de rafraîchir l’access token via le cookie HttpOnly (Strict) posé par le login
async function refreshAccessToken() {
  try {
    const r = await fetch(`${BASE}/seih/identity/hospital/refresh`, {
      method: "POST",
      credentials: "include", // ← indispensable pour envoyer le cookie HttpOnly de refresh
      headers: { Accept: "application/json" },
    });
    if (!r.ok) return null;
    const data = await r.json().catch(() => null);
    const token =
      data?.accessToken ||
      data?.result?.accessToken ||
      data?.result?.token ||
      null;
    if (token) {
      // setToken(token);
      return token;
    }
    return null;
  } catch {
    return null;
  }
}
export async function apiFetch(
  path,
  { method = "GET", headers = {}, body, retry = true } = {},
) {
  const url = BASE + path;
  const finalHeaders = new Headers({
    Accept: "application/json",
    ...headers,
    ...(body && !headers["Content-Type"]
      ? { "Content-Type": "application/json" }
      : {}),
  });

  let res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body && (typeof body === "string" ? body : JSON.stringify(body)),
    credentials: "include", // ⟵ envoie les cookies HttpOnly
  });

  // Si 401 → tente un refresh en appelant l’endpoint serveur qui régénère les cookies
  if (res.status === 401 && retry) {
    const r = await fetch(BASE + "/auth/refresh", {
      method: "POST",
      credentials: "include", // ⟵ envoie le cookie refresh HttpOnly
    });
    if (r.ok) {
      // réessaie une seule fois
      return apiFetch(path, { method, headers, body, retry: false });
    }
  }
  return res;
}

/** ====== COLONNES TABLE ====== */
const columns = [
  { label: "Code", accessor: "code" },
  { label: "Nom", accessor: "name" },
  { label: "Ville", accessor: "city" },
  { label: "Département", accessor: "department" },
  { label: "Statut", accessor: "status" },
];

const HospitalsPage = () => {
  const [rows, setRows] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Chargement des utilisateurs
  const load = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await apiFetch(`/seih/network-hospital/list`, {
        method: "POST",
      });

      const ct = res.headers.get("content-type") || "";
      const raw = ct.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        console.error(
          "API ERROR",
          res.status,
          Object.fromEntries(res.headers.entries()),
          raw,
        );
        if (res.status === 401) {
          throw new Error("Non autorisé. Connecte-toi à nouveau.");
        }
        throw new Error(`HTTP ${res.status}`);
      }

      // Map selon le payload du swagger (hospitalId, firstName, lastName, roles, …)
      const list = (Array.isArray(raw) ? raw : raw?.result || []).map((h) => ({
        id: h.id,
        code: h.code ?? "",
        name: h.name ?? "",
        city: h.city ?? "",
        department: h.department ?? "",
        email: h.email ?? "",
        phoneNumber: h.phoneNumber ?? "",
        address: h.address ?? "",
        isActive: h.isActive ?? "",
        status: h.isActive ? "Actif" : "Inactif",
      }));

      setRows(list);
    } catch (e) {
      setErr(
        "Chargement impossible. Assure-toi d'être connecté (login), que l'API est en HTTPS et que le refresh fonctionne.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleView = (hospital) => setSelectedHospital(hospital);

  const handleEdit = (hospital) => {
    console.log("✏️ Editing:", hospital);
  };

  const handleDelete = async (hospital) => {
    const ok = window.confirm(`🗑️ Supprimer ${hospital.name} ?`);
    if (!ok) return;
    // 👉 appelle ici ton endpoint de suppression puis:
    // await apiFetch(`/seih/hospital/hospital/${hospital.id}`, { method: 'DELETE' });
    // await load();
    alert("Suppression simulée (branche l'API).");
  };

  const handleCloseModal = () => setSelectedHospital(null);

  return (
    <div className="flex flex-col flex-1 min-h-screen text-white dark:text-black transition-all duration-300">
      <div className="max-w-7xl mx-auto px-2 w-full">
        <div className="backdrop-blur-xl bg-white/10 border border-white/10 dark:border-gray-300/30 rounded-xl shadow-xl p-4 sm:p-6 transition-all duration-500">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold">Liste des hôpitaux</h1>
            <button
              onClick={load}
              className="px-3 py-1 rounded-md bg-white/10 text-white text-sm hover:bg-white/20"
            >
              Rafraîchir
            </button>
          </div>

          {err && (
            <div className="mb-3 text-sm text-red-300 dark:text-red-700">
              {err}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl">
            <div className="min-w-[600px]">
              <Table
                data={loading ? [] : rows}
                columns={columns}
                onView={handleView} // 👈 la page décide d’ouvrir ModalViewCompte
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {loading && (
                <div className="px-3 py-2 opacity-70 text-sm">Chargement…</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedHospital && (
        <ModalViewCompte
          compte={selectedHospital}
          onClose={handleCloseModal}
          onEdit={async () => {
            setSelectedHospital(null);
            await load();
          }}
          onDelete={async (row) => {
            setSelectedHospital(null);
            await handleDelete(row);
            await load();
          }}
        />
      )}
    </div>
  );
};

export default HospitalsPage;
