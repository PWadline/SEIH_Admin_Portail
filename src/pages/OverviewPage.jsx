import { Building2, Hospital, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../components/common/StatCard";
import TransferByHospitalChart from "../components/overview/TransferByHospitalChart";
import { useEffect, useState } from "react";
import { seihFetch } from "../services/seihApi";
import { useNavigate } from "react-router-dom";

const OverviewPage = () => {
  const [totalHospitals, setTotalHospitals] = useState(0);
  const [activeHospitals, setActiveHospitals] = useState(0);
  const [totalTransfers, setTotalTransfers] = useState(0);
  const [transfersByHospital, setTransfersByHospital] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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
        const resHosp = await seihFetch("/seih/network-hospital/list", {
          method: "POST",
        });

        const dataHosp = await resHosp.json();
        const hospitals = dataHosp.result || dataHosp || [];

        setTotalHospitals(hospitals.length);
        setActiveHospitals(hospitals.filter((h) => h.isActive).length);

        const transfersRes = await seihFetch("/dme/transfers/list", {
          method: "POST",
        });

        const transfersJson = await transfersRes.json();
        const transfers = transfersJson.result || [];

        setTotalTransfers(transfers.length);

        const grouped = {};

        transfers.forEach((t) => {
          const from = t.hospitalFrom || "Inconnu";
          const to = t.hospitalTo || "Inconnu";

          if (!grouped[from]) grouped[from] = 0;
          grouped[from]++;

          if (!grouped[to]) grouped[to] = 0;
          grouped[to]++;
        });

        const chartData = Object.entries(grouped).map(([name, value]) => ({
          name,
          value,
        }));

        setTransfersByHospital(chartData);
      } catch (e) {
        console.error("❌ Erreur Overview :", e);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-screen text-white dark:text-black transition-all duration-300">
      <div>
        <div className="max-w-7xl mx-auto px-2">
          <div className="backdrop-blur-xl bg-white/10 border border-white/10 dark:border-gray-300/30 rounded-xl shadow-xl p-4 sm:p-6 transition-all duration-500">
            <motion.div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <StatCard
                name="Total d'hôpitaux"
                icon={Building2}
                value={totalHospitals}
                color="#4F46E5"
                onClick={() => navigate("/Hospitals")}
              />

              <StatCard
                name="Hôpitaux actifs"
                icon={Hospital}
                value={activeHospitals}
                color="#10B981"
                onClick={() => navigate("/Hospitals")}
              />

              <StatCard
                name="Total transferts"
                icon={ArrowRightLeft}
                value={totalTransfers}
                color="#EC4899"
                onClick={() => navigate("/Transfers")}
              />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <TransferByHospitalChart data={transfersByHospital} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;

