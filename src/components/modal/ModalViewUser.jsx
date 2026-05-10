import Draggable from "react-draggable";
import { useState } from "react";
import { X, Pencil } from "lucide-react";
import ModalRemplirUser from "./ModalRemplirUser";

const ModalViewUser = ({
  user,
  onClose,
  onEdit,
}) => {

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  if (!user) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">

        <Draggable handle=".drag-handle">

          <div
            className="
              w-[90%] max-w-md p-6 relative rounded-2xl

              text-white dark:text-black

              shadow-[0_4px_20px_rgba(0,0,0,0.4)]

              bg-[#1D2635]/80
              dark:bg-[#E4EAF9]/80

              backdrop-blur-xl
            "
          >

            {/* HEADER */}
            <div className="drag-handle flex justify-end gap-4 mb-4 cursor-move">

              <button
                onClick={() => setIsEditModalOpen(true)}

                className="
                  text-blue-500
                  hover:scale-110
                  transition
                "
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={onClose}

                className="
                  text-red-500
                  hover:scale-110
                  transition
                "
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">

              <div
                className="
                  w-20 h-20 rounded-full

                  bg-gradient-to-br
                  from-[#7D93CB]
                  to-[#425CA3]

                  flex items-center justify-center

                  text-2xl font-bold text-white

                  shadow-lg

                  mb-3
                "
              >
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>

              {/* NAME */}
              <div className="text-xl font-bold text-center">

                {user.fullName}
              </div>

              {/* ROLE */}
              <div
                className="
                  mt-2

                  px-3 py-1 rounded-full

                  text-xs font-semibold

                  bg-blue-500/20
                  text-blue-300 dark:text-blue-900
                "
              >
                {user.roles}
              </div>
            </div>

            <div className="space-y-2">

              {[
                {
                  label: "Nom",
                  value: user.lastName,
                },

                {
                  label: "Prénom",
                  value: user.firstName,
                },

                {
                  label: "Email",
                  value: user.email,
                },

                {
                  label: "Statut",
                  value: user.isDeleted
                    ? "Inactif"
                    : "Actif",
                },


              ].map(({ label, value }) => (

                <div
                  key={label}

                  className="
                    grid grid-cols-2 gap-4

                    py-2

                    border-b border-white/10
                  "
                >

                  <span
                    className="
                      text-sm opacity-70
                    "
                  >
                    {label}
                  </span>

                  <span
                    className="
                      text-sm font-medium

                      text-right

                      break-words
                    "
                  >
                    {value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Draggable>
      </div>

      {isEditModalOpen && (
        <ModalRemplirUser
          user={user}

          onClose={() =>
            setIsEditModalOpen(false)
          }

          onSave={(updated) => {

            setIsEditModalOpen(false);

            onEdit?.(updated);
          }}
        />
      )}
    </>
  );
};

export default ModalViewUser;