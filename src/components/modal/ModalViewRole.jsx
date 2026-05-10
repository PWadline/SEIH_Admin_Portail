// src/components/roles/ModalViewRole.jsx
import { useEffect, useMemo, useState } from "react";
import Draggable from "react-draggable";
import { X, Pencil, Trash, Save, Search } from "lucide-react";

// 👇 Définition locale des permissions (plus besoin de les passer en props)
const ALL_PERMISSIONS = [
  "dossier:read", "dossier:create", "dossier:update", "dossier:delete",
  "transfert:read", "transfert:create", "transfert:update", "transfert:approve",
  "pharma:read", "pharma:dispense", "pharma:update",
  "lab:read", "lab:validate", "lab:publish",
  "billing:read", "billing:create", "billing:update",
  "report:read", "report:export",
  "admin:user:manage", "admin:role:manage", "admin:settings:manage",
];

const ModalViewRole = ({
  role,       // { id, name, permissions: string[] } ou null
  mode = "view", // "view" | "create" | "edit"
  onClose,
  onSave,
  onDelete,
}) => {
  const isCreateMode = mode === "create";
  const [isDragging, setIsDragging] = useState(false);
  const [isEditMode, setIsEditMode] = useState(isCreateMode); // auto en édition si création
  const [name, setName] = useState(role?.name ?? "");
  const [selected, setSelected] = useState(new Set(role?.permissions ?? []));
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (role) {
      setName(role.name || "");
      setSelected(new Set(role.permissions || []));
    }
  }, [role]);

  const togglePermission = (perm) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(perm) ? next.delete(perm) : next.add(perm);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_PERMISSIONS;
    return ALL_PERMISSIONS.filter((p) => p.toLowerCase().includes(q));
  }, [query]);

  const handleSave = () => {
    onSave?.({
      id: role?.id || Date.now().toString(),
      name: name.trim(),
      permissions: Array.from(selected),
    });
    if (!isCreateMode) setIsEditMode(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Draggable handle=".drag-handle" onStart={() => setIsDragging(true)} onStop={() => setIsDragging(false)}>
        <div className="w-[94%] max-w-4xl relative rounded-2xl shadow-xl bg-[#1D2635]/85 dark:bg-[#E4EAF9]/85 text-white dark:text-black backdrop-blur-xl">
          {/* Header */}
          <div className="drag-handle flex justify-end gap-4 p-4 border-b border-white/10 dark:border-black/10 cursor-move">
            <button onClick={onClose} className="text-red-600 hover:scale-110 transition"><X size={20} /></button>
            {!isCreateMode && (
              <>
                <button onClick={() => setIsEditMode((v) => !v)} className="text-blue-600 hover:scale-110 transition">
                  <Pencil size={18} />
                </button>
                <button onClick={() => onDelete?.(role)} className="text-red-500 hover:scale-110 transition">
                  <Trash size={18} />
                </button>
              </>
            )}
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-center">
              {isCreateMode ? "Créer un rôle" : "Détails du rôle"}
            </h2>

            {/* Nom du rôle */}
            <div>
              <div className="text-sm opacity-80 mb-1">Nom du rôle</div>
              {isEditMode ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md px-3 py-2 bg-white/10 dark:bg-black/10 focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du rôle"
                />
              ) : (
                <div className="font-semibold">{role?.name}</div>
              )}
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Permissions</h3>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher une permission…"
                  className="w-full pl-9 pr-3 py-2 rounded-md bg-white/10 dark:bg-black/10 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[50vh] overflow-auto">
                {filtered.map((perm) => (
                  <label key={perm} className={`flex items-center gap-2 px-3 py-2 rounded-md border ${selected.has(perm) ? "bg-white/15 dark:bg-black/15" : ""}`}>
                    <input
                      type="checkbox"
                      disabled={!isEditMode}
                      checked={selected.has(perm)}
                      onChange={() => togglePermission(perm)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm">{perm}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t border-white/10 dark:border-black/10">
            <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white">
              Fermer
            </button>
            {(isEditMode || isCreateMode) && (
              <button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2">
                <Save size={18} /> {isCreateMode ? "Créer" : "Enregistrer"}
              </button>
            )}
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default ModalViewRole;
