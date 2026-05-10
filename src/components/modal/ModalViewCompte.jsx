import Draggable from "react-draggable";
import { useState } from "react";
import { X, Pencil } from "lucide-react";
import ModalRemplirCompte from "./ModalRemplirCompte";

const ModalViewCompte = ({ compte, onClose, onEdit }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!compte) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <Draggable
          handle=".drag-handle"
          onStart={() => setIsDragging(true)}
          onStop={() => setIsDragging(false)}
        >
          <div
            className="
            w-[90%] max-w-md p-6 relative rounded-2xl 
            text-white dark:text-black
            shadow-[0_4px_20px_rgba(0,0,0,0.4)] 
            bg-[#1D2635]/80 dark:bg-[#E4EAF9]/80 
            backdrop-blur-xl
          "
          >
            <div className="drag-handle flex justify-end gap-4 mb-4 relative cursor-move">
              {[
                {
                  icon: <X size={20} />,
                  onClick: onClose,
                  color: "text-red-600",
                  label: "Fermer",
                },
                {
                  icon: <Pencil size={18} />,
                  onClick: () => setIsEditModalOpen(true),
                  color: "text-blue-600",
                  label: "Modifier",
                },

              ].map(({ icon, onClick, color, label }, index) => (
                <div key={index} className="relative group">
                  <button
                    onClick={onClick}
                    className={`${color} hover:scale-110 transition`}
                  >
                    {icon}
                  </button>
                  <span
                    className="absolute top-full right-0 mt-2 px-2 py-1 text-xs rounded shadow z-50 
                    whitespace-nowrap transition-opacity opacity-0 group-hover:opacity-100
                    bg-black text-white dark:bg-white dark:text-black"
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Contenu du modal */}
            <div>
              <h2 className="text-center text-2xl font-bold mb-6 text-white dark:text-black">
                Détails de l'hôpital
              </h2>
              <div className="space-y-2">
                {[
                  { label: "Code", value: compte.code },
                  { label: "Nom", value: compte.name },
                  { label: "Ville", value: compte.city },
                  { label: "Département", value: compte.department },
                  { label: "Adresse", value: compte.address },
                  { label: "Email", value: compte.email },
                  { label: "Téléphone", value: compte.phoneNumber },
                  { label: "Statut", value: compte.isActive ? "🟢 Actif" : "🔴 Inactif" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="grid grid-cols-2 gap-4 py-2 border-b border-white/10"
                  >
                    <span className="text-sm text-gray-300 dark:text-gray-600">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-right break-words">
                      {value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Draggable>
      </div>

      {/* Modal d'édition */}
      {isEditModalOpen && (
        <ModalRemplirCompte
          compte={compte}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedCompte) => {
            setIsEditModalOpen(false);
            onEdit && onEdit(updatedCompte);
          }}
        />
      )}
    </>
  );
};

export default ModalViewCompte;
