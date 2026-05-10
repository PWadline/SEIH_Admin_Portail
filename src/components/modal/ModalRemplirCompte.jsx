import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { X } from "lucide-react";
import CustomButton from "../common/CustomButton";

const BASE = (import.meta.env.VITE_BASE_API_URL || "https://localhost:5258")
  .toString()
  .replace(/\/$/, "");

async function apiJson(url, { method = "POST", body, headers } = {}) {
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(headers || {}),
    },
    body: body
      ? typeof body === "string"
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    try {
      data = await res.text();
    } catch {
      data = null;
    }
  }

  return { res, data };
}

const FormRow = ({ label, children }) => (
  <div className="grid grid-cols-3 items-center gap-4">
    <label className="text-sm font-medium text-gray-200 dark:text-gray-800">
      {label}
    </label>
    <div className="col-span-2">{children}</div>
  </div>
);

const ModalRemplirCompte = ({ compte, onClose, onSave }) => {
  const isEditing = !!compte;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    city: "",
    department: "",
    address: "",
    email: "",
    phoneNumber: "",
    publicKey: "",
    integrationType: 1,
    isActive: true,
  });

  useEffect(() => {
    if (compte) {

      setFormData({
        id: compte.id,
        name: compte.name || "",
        code: compte.code || "",
        city: compte.city || "",
        department: compte.department || "",
        address: compte.address || "",
        email: compte.email || "",
        phoneNumber: compte.phoneNumber || "",
        publicKey: compte.publicKey || "",
        integrationType: compte.integrationType || 1,
        isActive: compte.isActive ?? true,

      });
      console.log("COMPTE =", compte);
    }
  }, [compte]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid =
    formData.name &&
    formData.code &&
    formData.city &&
    formData.department;

  const handleSubmit = async () => {
    if (!isFormValid || saving) return;

    setSaving(true);
    setError("");

    try {
      const payload = {
        ...formData,
        id: formData.id,
        isActive: formData.isActive,
      };

      // 🔥 envoyer la clé seulement si remplie
      if (formData.publicKey?.trim()) {
        payload.publicKey =
          formData.publicKey.replace(/\\n/g, "\n");
      }

      console.log("📦 PAYLOAD SENT:", payload);

      const url = isEditing
        ? `${BASE}/api/hospital/update`
        : `${BASE}/api/hospital/create`;
      console.log("📦 PAYLOAD SENT:", payload);
      const { res, data } = await apiJson(url, {
        method: "POST",
        body: payload,
      });

      if (!res.ok || data?.isOk === false) {
        const msg =
          data?.message || data?.errorMessages?.[0] || `Erreur (${res.status})`;
        throw new Error(msg);
      }
      await apiJson(`${BASE}/api/sync/hospitals`, {
        method: "POST",
      });

      onSave?.(payload);
      onClose?.();
    } catch (e) {
      console.error(e);
      setError(e.message || "Erreur lors de l'opération.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 rounded-lg bg-white/10 dark:bg-gray-200/40 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#425CA3] text-white dark:text-black placeholder-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Draggable handle=".drag-handle">
        <div
          className="
          w-[95%] max-w-xl p-6 relative rounded-2xl
          text-white dark:text-black
          shadow-[0_4px_20px_rgba(0,0,0,0.4)]
          bg-[#1D2635]/80 dark:bg-[#E4EAF9]/80
          backdrop-blur-xl
        "
        >
          <div className="drag-handle flex items-center justify-between border-b pb-3 mb-4 cursor-move">
            <h2 className="text-lg font-bold uppercase">
              {isEditing ? "Modifier Compte" : "Créer Compte"}
            </h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-white dark:text-black hover:text-red-400" />
            </button>
          </div>

          {error && (
            <div className="mb-3 text-sm text-red-300 dark:text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
            <FormRow label="Nom">
              <input
                className={inputClass}
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </FormRow>

            <FormRow label="Code">
              <input
                className={inputClass}
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
              />
            </FormRow>

            <FormRow label="Ville">
              <input
                className={inputClass}
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </FormRow>

            <FormRow label="Département">
              <input
                className={inputClass}
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
              />
            </FormRow>

            <FormRow label="Adresse">
              <input
                className={inputClass}
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </FormRow>

            <FormRow label="Email">
              <input
                type="email"
                className={inputClass}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </FormRow>

            <FormRow label="Téléphone">
              <input
                className={inputClass}
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
              />
            </FormRow>

            {isEditing && (
              <FormRow label="Activer">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleChange("isActive", !formData.isActive)}
                    className={`w-14 h-7 flex items-center rounded-full p-1 transition ${formData.isActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${formData.isActive ? "translate-x-7" : "translate-x-0"
                        }`}
                    />
                  </button>

                  <span className="ml-3 text-sm">
                    {formData.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
              </FormRow>
            )}

            <FormRow label="Clé publique">
              <textarea
                className={inputClass + " min-h-[120px] font-mono text-xs"}
                value={formData.publicKey}
                onChange={(e) =>
                  handleChange("publicKey", e.target.value)
                }
                placeholder="-----BEGIN PUBLIC KEY-----"
              />
            </FormRow>

            <FormRow label="Type">
              <select
                className={inputClass}
                value={formData.integrationType}
                onChange={(e) =>
                  handleChange("integrationType", Number(e.target.value))
                }
              >
                <option value={1}>Type 1</option>
                <option value={2}>Type 2</option>
                <option value={3}>Type 3</option>
              </select>
            </FormRow>
          </div>

          {/* Boutons */}
          <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
            <CustomButton
              label={
                isEditing
                  ? saving
                    ? "Modification…"
                    : "Modifier"
                  : saving
                    ? "Création…"
                    : "Créer"
              }
              onClick={handleSubmit}
              color="#425CA3"
              disabled={!isFormValid || saving}
            />
            <CustomButton label="Annuler" onClick={onClose} color="#EF4444" />
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default ModalRemplirCompte;
