import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { X } from "lucide-react";
import CustomButton from "../common/CustomButton";

const ToggleSwitch = ({
  checked,
  onChange,
}) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`
        w-14 h-7 flex items-center
        rounded-full p-1 cursor-pointer
        transition duration-300

        ${checked
          ? "bg-gradient-to-r from-green-400 to-green-600 shadow-lg"
          : "bg-gray-400"
        }
      `}
    >
      <div
        className={`
          bg-white w-5 h-5 rounded-full shadow-md
          transform transition duration-300

          ${checked
            ? "translate-x-7"
            : "translate-x-0"
          }
        `}
      />
    </div>
  );
};

const BASE = (
  import.meta.env.VITE_BASE_API_URL || "https://localhost:5259"
)
  .toString()
  .replace(/\/$/, "");

const ModalRemplirUser = ({
  user,
  onClose,
  onSave,
}) => {

  const isEditing = !!user;

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [resetPassword, setResetPassword] =
    useState(false);

  const [roles, setRoles] =
    useState([]);

  const [loadingRoles, setLoadingRoles] =
    useState(true);

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      roleId: "",
      isActive: true,
    });
  useEffect(() => {

    const loadRoles = async () => {

      try {

        setLoadingRoles(true);

        const res = await fetch(
          `${BASE}/seih/hospital/role/get/list`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          },
        );

        const data = await res.json();

        console.log("ROLES =", data);

        if (
          !res.ok ||
          data?.isOk === false
        ) {
          throw new Error(
            "Erreur chargement rôles",
          );
        }

        setRoles(data.result || []);

        // 🔥 si création → sélectionner Utilisateur par défaut
        if (!user) {

          const defaultRole =
            (data.result || []).find(
              (r) =>
                r.name === "Utilisateur",
            );

          if (defaultRole) {

            setFormData((prev) => ({
              ...prev,
              roleId: defaultRole.id,
            }));
          }
        }

      } catch (e) {

        console.error(e);

        setError(
          "Impossible de charger les rôles",
        );

      } finally {

        setLoadingRoles(false);
      }
    };

    loadRoles();

  }, []);

  useEffect(() => {

    if (user) {

      setFormData({
        id: user.id,

        firstName:
          user.firstName || "",

        lastName:
          user.lastName || "",

        email:
          user.email || "",

        roleId:
          user.roleId || "",

        isActive:
          !user.isDeleted,
      });
    }
  }, [user]);

  const handleChange = (
    key,
    value,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email;

  const handleSubmit = async () => {

    if (!isFormValid || saving)
      return;

    setSaving(true);
    setError("");

    try {

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        roleId: formData.roleId,
      };

      // 🔥 uniquement en modification
      if (isEditing) {

        payload.id = formData.id;
        payload.isActive = formData.isActive;
        payload.resetPassword = resetPassword;
      }

      console.log(
        "PAYLOAD USER:",
        payload,
      );

      const url = isEditing
        ? `${BASE}/seih/hospital/user/update`
        : `${BASE}/seih/hospital/user/create`;

      const res = await fetch(url, {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("RESPONSE =", data);

      if (
        !res.ok ||
        data?.isOk === false
      ) {
        throw new Error(
          data?.message ||
          data?.errorMessages?.[0] ||
          "Erreur serveur"
        );
      }

      // 🔥 mot de passe généré en création
      if (!isEditing && data?.result) {

        alert(
          `✅ Utilisateur créé\n\nMot de passe : ${data.result}`
        );
      }

      onSave?.(payload);

      onClose?.();

    } catch (e) {

      console.error(e);

      setError(
        e.message ||
        "Erreur lors de l'opération.",
      );

    } finally {

      setSaving(false);
    }
  };

  const inputClass =
    `
      w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-gray-200/40 backdrop-blur-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#425CA3] text-white dark:text-black placeholder-gray-400 transition
    `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">

      <Draggable handle=".drag-handle">

        <div
          className="
            w-[92%]
            max-w-lg

            p-6

            relative rounded-2xl

            text-white dark:text-black

            shadow-[0_4px_20px_rgba(0,0,0,0.4)]

            bg-[#1D2635]/80
            dark:bg-[#E4EAF9]/80

            backdrop-blur-xl
          "
        >

          {/* HEADER */}
          <div
            className="
              drag-handle

              flex items-center justify-between

              border-b border-white/10

              pb-3 mb-6

              cursor-move
            "
          >

            <div>

              <h2
                className="
                  text-xl font-bold uppercase
                "
              >
                {isEditing
                  ? "Modifier utilisateur"
                  : "Créer utilisateur"}
              </h2>

              <p
                className="
                  text-xs opacity-60 mt-1
                "
              >
                Gestion des informations utilisateur
              </p>
            </div>

            <button
              onClick={onClose}

              className="
                hover:scale-110
                transition
              "
            >
              <X
                className="
                  w-6 h-6

                  text-white
                  dark:text-black

                  hover:text-red-400
                "
              />
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="
                mb-4

                text-sm

                text-red-300
                dark:text-red-700
              "
            >
              {error}
            </div>
          )}

          {/* FORM */}
          <div className="space-y-5">

            {/* NOM */}
            <div>

              <label
                className="
                  block mb-2

                  text-sm font-semibold

                  text-gray-200
                  dark:text-gray-800
                "
              >
                Nom
              </label>

              <input
                className={inputClass}

                value={formData.lastName}

                onChange={(e) =>
                  handleChange(
                    "lastName",
                    e.target.value,
                  )
                }

                placeholder="Nom"
              />
            </div>

            {/* PRENOM */}
            <div>

              <label
                className="
                  block mb-2

                  text-sm font-semibold

                  text-gray-200
                  dark:text-gray-800
                "
              >
                Prénom
              </label>

              <input
                className={inputClass}

                value={formData.firstName}

                onChange={(e) =>
                  handleChange(
                    "firstName",
                    e.target.value,
                  )
                }

                placeholder="Prénom"
              />
            </div>

            {/* EMAIL */}
            <div>

              <label
                className="
                  block mb-2

                  text-sm font-semibold

                  text-gray-200
                  dark:text-gray-800
                "
              >
                Email
              </label>

              <input
                type="email"

                className={inputClass}

                value={formData.email}

                onChange={(e) =>
                  handleChange(
                    "email",
                    e.target.value,
                  )
                }

                placeholder="email@hum.ht"
              />
            </div>

            {/* ROLE */}
            <div>

              <label
                className="
                  block mb-2

                  text-sm font-semibold

                  text-gray-200
                  dark:text-gray-800
                "
              >
                Rôle
              </label>

              <select
                className={inputClass}

                value={formData.roleId}

                disabled={loadingRoles}

                onChange={(e) =>
                  handleChange(
                    "roleId",
                    e.target.value,
                  )
                }
              >

                <option value="">
                  {loadingRoles
                    ? "Chargement..."
                    : "Sélectionner un rôle"}
                </option>

                {roles.map((role) => (

                  <option
                    key={role.id}
                    value={role.id}
                  >
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SWITCHES */}
            {isEditing && (

              <div
                className="
                  mt-4

                  rounded-xl

                  bg-white/5

                  border border-white/10

                  p-4

                  space-y-4
                "
              >

                {/* STATUS */}
                <div className="flex items-center justify-between">

                  <div>

                    <div className="font-semibold">
                      Statut du compte
                    </div>

                    <div className="text-xs opacity-60">
                      Activer ou désactiver le compte
                    </div>
                  </div>

                  <ToggleSwitch
                    checked={formData.isActive}

                    onChange={(val) =>
                      handleChange(
                        "isActive",
                        val,
                      )
                    }
                  />
                </div>

                {/* RESET PASSWORD */}
                <div className="flex items-center justify-between">

                  <div>

                    <div className="font-semibold">
                      Réinitialiser mot de passe
                    </div>

                    <div className="text-xs opacity-60">
                      Générer un nouveau mot de passe
                    </div>
                  </div>

                  <ToggleSwitch
                    checked={resetPassword}

                    onChange={(val) =>
                      setResetPassword(val)
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div
            className="
              flex justify-between items-center

              mt-8

              gap-4
            "
          >

            <CustomButton
              label={
                isEditing
                  ? saving
                    ? "Modification..."
                    : "Sauvegarder"
                  : saving
                    ? "Création..."
                    : "Créer"
              }

              onClick={handleSubmit}

              color="#425CA3"

              disabled={
                !isFormValid ||
                saving
              }
            />

            <CustomButton
              label="Annuler"

              onClick={onClose}

              color="#EF4444"
            />
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default ModalRemplirUser;