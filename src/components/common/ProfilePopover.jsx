import { useState } from "react";
import {
  UserCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import CustomButton from "./CustomButton";

const ProfilePopover = ({
  onLogout,
}) => {

  const user = JSON.parse(
    sessionStorage.getItem("user") || "{}",
  );

  console.log("USER SESSION =", user);

  console.log(
    "ALL SESSION STORAGE =",
    sessionStorage
  );

  const fullName =
    user.fullName ||
    user.name ||
    `${user.firstName || user.first_name || ""} ${user.lastName || user.last_name || ""
    }`;

  const role =
    user.role ||
    user.roles?.[0]?.name ||
    user.roles?.[0] ||
    "";

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showOldPassword, setShowOldPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const handlePasswordChange = async () => {
    if (!oldPassword.trim()) {
      return alert(
        "Ancien mot de passe requis.",
      );
    }

    if (!newPassword.trim()) {
      return alert(
        "Nouveau mot de passe requis.",
      );
    }

    if (newPassword.length < 8) {
      return alert(
        "Mot de passe trop court.",
      );
    }

    if (newPassword !== confirmPassword) {
      return alert(
        "Les mots de passe ne correspondent pas.",
      );
    }

    if (oldPassword === newPassword) {
      return alert(
        "Le nouveau doit être différent de l'ancien.",
      );
    }

    try {
      const accessToken =
        sessionStorage.getItem("token") ||
        document.cookie
          .split("; ")
          .find((row) =>
            row.startsWith("SessionId="),
          )
          ?.split("=")[1];

      if (!accessToken) {
        return alert("Token manquant ❌");
      }

      const res = await fetch(
        "http://localhost:5258/seih/hospital/user/update/password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || data?.isError) {
        return alert(
          "Ancien mot de passe incorrect ❌",
        );
      }

      alert("Mot de passe modifié ✅");

      setChangingPassword(false);

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);

      alert("Erreur serveur ❌");
    }
  };

  return (
    <div className="dark:bg-white bg-[#1D2635] shadow-xl rounded-xl p-4 w-72 space-y-3 dark:text-gray-800 text-white">
      {changingPassword ? (
        <div className="space-y-2">
          {/* OLD PASSWORD */}
          <div className="relative">
            <input
              type={
                showOldPassword
                  ? "text"
                  : "password"
              }
              placeholder="Ancien mot de passe"
              value={oldPassword}
              onChange={(e) =>
                setOldPassword(e.target.value)
              }
              className="w-full px-3 py-2 pr-10 rounded border shadow text-black"
            />

            <button
              type="button"
              onClick={() =>
                setShowOldPassword(
                  !showOldPassword,
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showOldPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* NEW PASSWORD */}
          <div className="relative">
            <input
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              className="w-full px-3 py-2 pr-10 rounded border shadow text-black"
            />

            <button
              type="button"
              onClick={() =>
                setShowNewPassword(
                  !showNewPassword,
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showNewPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <div className="relative">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirmer"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value,
                )
              }
              className="w-full px-3 py-2 pr-10 rounded border shadow text-black"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword,
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <div className="flex justify-between gap-2">
            <CustomButton
              label="Annuler"
              onClick={() =>
                setChangingPassword(false)
              }
            />

            <CustomButton
              label="Valider"
              onClick={
                handlePasswordChange
              }
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 border-2 border-white shadow flex items-center justify-center">
              <UserCircle className="w-20 h-20 text-gray-600" />
            </div>

            <p className="font-semibold text-base">
              {fullName}
            </p>

            {role && (
              <div className="px-3 py-1 rounded-full text-xs font-semibold bg-[#425CA3]/20 text-[#7D93CB] border border-[#7D93CB]/20">
                {role}
              </div>
            )}

          </div>

          <div className="pt-2 space-y-1">
            <button
              onClick={() =>
                setChangingPassword(true)
              }
              className="w-full text-left px-3 py-2 rounded dark:hover:bg-gray-100 hover:bg-gray-700 transition"
            >
              Changer mot de passe
            </button>

            <CustomButton
              label="Se déconnecter"
              className="w-full"
              onClick={onLogout}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePopover;
