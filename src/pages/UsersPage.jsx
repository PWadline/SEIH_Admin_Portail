import { useEffect, useState } from "react";
import Table from "../components/common/Table";
import ModalViewUser from "../components/modal/ModalViewUser";

const BASE = (
  import.meta.env.VITE_BASE_API_URL || "https://localhost:5258"
).replace(/\/$/, "");

async function apiFetch(
  path,
  { method = "GET", headers = {}, body } = {},
) {
  const res = await fetch(BASE + path, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return res;
}

const columns = [
  { label: "Nom complet", accessor: "fullName" },
  { label: "Nom utilisateur", accessor: "userName" },
  { label: "Email", accessor: "email" },
  { label: "Rôle", accessor: "roles" },
  { label: "Créé le", accessor: "created" },
];

const UsersPage = () => {
  const [rows, setRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const sessionUser = JSON.parse(
    sessionStorage.getItem("user") || "{}",
  );

  const currentRole =
    sessionUser.role ||
    sessionUser.roles?.[0]?.name ||
    sessionUser.roles?.[0] ||
    "";

  const load = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await apiFetch(
        "/seih/hospital/user/get/list",
        {
          method: "POST",
        },
      );

      const raw = await res.json();

      if (!res.ok || raw?.isOk === false) {
        throw new Error("Erreur chargement utilisateurs");
      }

      const list = (raw?.result || []).map((u) => ({
        id: u.userId,
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`,
        userName: u.userName ?? "",
        email: u.email ?? "",
        roleId: u.roleId ?? "",
        roles: u.roles ?? "",
        isDeleted: u.isDeleted,
        created: u.created
          ? new Date(u.created).toLocaleString("fr-FR")
          : "",
      }));

      setRows(list);

    } catch (e) {
      console.error(e);

      setErr(
        "Impossible de charger les utilisateurs",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleView = (user) => {
    setSelectedUser(user);
  };



  if (currentRole === "Utilisateur") {
    return (
      <div
        className="
        flex items-center justify-center
        h-screen
        text-white
      "
      >
        Accès refusé
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-1 min-h-screen text-white dark:text-black transition-all duration-300">
      <div className="max-w-7xl mx-auto px-2 w-full">

        <div
          className="
            backdrop-blur-xl
            bg-white/10
            border border-white/10
            dark:border-gray-300/30
            rounded-xl
            shadow-xl
            p-4 sm:p-6
          "
        >

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">
              Utilisateurs
            </h1>
          </div>

          {err && (
            <div className="mb-4 text-red-400 text-sm">
              {err}
            </div>
          )}

          <Table
            data={loading ? [] : rows}
            columns={columns}

            onView={handleView}

            onEdit={() => { }}
            onDelete={() => { }}
          />

          {loading && (
            <div className="mt-3 text-sm opacity-70">
              Chargement...
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <ModalViewUser
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onEdit={async () => {
            setSelectedUser(null);
            await load();
          }}
        />
      )}
    </div>
  );
};

export default UsersPage;