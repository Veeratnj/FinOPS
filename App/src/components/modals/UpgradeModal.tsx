import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  requiredPlan?: string;
}

const UpgradeModal = ({
  open,
  onClose,
  requiredPlan = "Platform+",
}: UpgradeModalProps) => {

  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-2xl border border-lime-500/20 bg-zinc-950 p-6 shadow-2xl">

        <div className="mb-4">

          <h2 className="text-2xl font-semibold text-white">
            Upgrade Required
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            This feature requires the{" "}
            <span className="text-lime-400 font-medium">
              {requiredPlan}
            </span>{" "}
            plan.
          </p>

        </div>

        <div className="space-y-3 text-sm text-zinc-300">

          <div>
            ✓ AI forecasting
          </div>

          <div>
            ✓ Advanced analytics
          </div>

          <div>
            ✓ Premium reporting
          </div>

          <div>
            ✓ Cost orchestration
          </div>

        </div>

        <div className="mt-6 flex gap-3">

          <button
            onClick={() => navigate("/plans-billing")}
            className="flex-1 rounded-xl bg-lime-500 px-4 py-3 text-sm font-medium text-black hover:bg-lime-400"
          >
            Upgrade Now
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            Maybe Later
          </button>

        </div>

      </div>

    </div>
  );
};

export default UpgradeModal;