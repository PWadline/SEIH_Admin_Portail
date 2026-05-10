import { useEffect, useState } from "react";
import Table from "../components/common/Table";

const BASE = (
  import.meta.env.VITE_BASE_API_URL || "https://localhost:5258"
).replace(/\/$/, "");

async function apiFetch(
  path,
  { method = "GET", headers = {}, body } = {}
) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  return res;
}

const columns = [
  { label: "Code", accessor: "code" },
  { label: "Hôpital Source", accessor: "hospitalFrom" },
  { label: "Hôpital Destination", accessor: "hospitalTo" },
  { label: "Date", accessor: "created" },
  { label: "Statut", accessor: "status" },
];

const TransfersPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {

      await fetch(
        "http://localhost:5258/api/admin/transfers/sync/all-transfers",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        },
      );

      setLoading(true);
      setErr("");

      const res = await apiFetch("/dme/transfers/list", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || !data?.isOk) {
        throw new Error("Erreur API");
      }

      const list = (data.result || []).map((t) => ({
        id: t.id,
        code: t.code,
        hospitalFrom: t.hospitalFrom,
        hospitalTo: t.hospitalTo,
        patientReference: t.patientReference || "N/A",
        message: t.message || "",
        created: new Date(t.created).toLocaleString("fr-FR"),
        status: t.status,
      }));

      setRows(list);
    } catch (e) {
      setErr("Impossible de charger les transferts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-screen text-white dark:text-black transition-all duration-300">
      <div className="max-w-7xl mx-auto px-2 w-full">
        <div className="backdrop-blur-xl bg-white/10 border border-white/10 dark:border-gray-300/30 rounded-xl shadow-xl p-4 sm:p-6">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold">Liste des transferts</h1>

          </div>

          {/* ERROR */}
          {err && (
            <div className="mb-3 text-sm text-red-300 dark:text-red-700">
              {err}
            </div>
          )}

          {/* TABLE */}
          <div className="overflow-x-auto rounded-xl">
            <div className="min-w-[800px]">
              <Table
                data={loading ? [] : rows}
                columns={columns}
                onView={null}
                onEdit={null}
                onDelete={null}
                showActions={false}
              />

              {loading && (
                <div className="px-3 py-2 opacity-70 text-sm">
                  Chargement…
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransfersPage;

