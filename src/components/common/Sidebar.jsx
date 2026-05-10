import { LayoutDashboard, Building2, UserCog, ArrowRightLeft, PlusCircle, } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import ModalRemplirCompte from "../modal/ModalRemplirCompte";
import ModalRemplirUser from "../modal/ModalRemplirUser";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },

  {
    name: "Hôpitaux",
    icon: Building2,
    href: "/hospitals",
  },

  {
    name: "Utilisateurs",
    icon: UserCog,
    href: "/users",
  },

  {
    name: "Transfers",
    icon: ArrowRightLeft,
    href: "/transfers",
  },
];

const Sidebar = () => {

  const location = useLocation();

  const sessionUser = JSON.parse(
    sessionStorage.getItem("user") || "{}",
  );

  const currentRole =
    sessionUser.role ||
    sessionUser.roles?.[0]?.name ||
    sessionUser.roles?.[0] ||
    "";

  const [isCompteModalOpen, setIsCompteModalOpen] =
    useState(false);

  const [isUserModalOpen, setIsUserModalOpen] =
    useState(false);

  const ishospitalsPage =
    location.pathname === "/hospitals";

  const isUsersPage =
    location.pathname === "/users";

  return (
    <nav className=" fixed top-[60px] left-0 w-full h-[36px] bg-[#425CA3] shadow-md z-40" >
      <div
        className=" flex items-center justify-between h-full px-4">

        <ul className="flex items-center gap-6">

          {NAV_ITEMS
            .filter((item) => {
              if (
                item.href === "/users" &&
                currentRole === "Utilisateur"
              ) {
                return false;
              }

              return true;
            })
            .map(
              ({
                name,
                icon: Icon,
                href,
              }) => (

                <li key={name}>

                  <NavLink
                    to={href}

                    className={({
                      isActive,
                    }) =>
                      `
                      flex items-center gap-2 px-4 py-1 transition-all duration-200 border-b-2
                      ${isActive
                        ? "border-white text-white"
                        : "border-transparent text-white hover:bg-white/10"
                      }
                    `
                    }
                  >

                    <Icon size={18} />

                    <span className="text-sm">
                      {name}
                    </span>
                  </NavLink>
                </li>
              ),
            )}
        </ul>

        <div className="flex items-center gap-2">

          {ishospitalsPage && (

            <button
              onClick={() =>
                setIsCompteModalOpen(true)
              }

              className=" flex items-center gap-2 px-4 py-1 rounded-md bg-white/10 text-white text-sm hover:bg-white/20 transition-all duration-200">

              <PlusCircle size={16} />

              Nouvel hôpital
            </button>
          )}

          {isUsersPage && (

            <button
              onClick={() =>
                setIsUserModalOpen(true)
              }

              className="flex items-center gap-2 px-4 py-1 rounded-md bg-white/10 text-white text-sm hover:bg-white/20 transition-all duration-200">

              <PlusCircle size={16} />

              Nouvel utilisateur
            </button>
          )}
        </div>
      </div>

      {isCompteModalOpen && (

        <ModalRemplirCompte
          compte={null}

          onClose={() =>
            setIsCompteModalOpen(false)
          }

          onSave={(newHospitalData) => {

            console.log(
              "Nouvel hôpital :",
              newHospitalData,
            );

            setIsCompteModalOpen(false);
          }}
        />
      )}

      {isUserModalOpen && (

        <ModalRemplirUser
          user={null}

          onClose={() =>
            setIsUserModalOpen(false)
          }

          onSave={(newUserData) => {

            console.log(
              "Nouvel utilisateur :",
              newUserData,
            );

            setIsUserModalOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Sidebar;