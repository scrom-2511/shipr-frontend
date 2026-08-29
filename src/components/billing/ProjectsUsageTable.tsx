import { Link } from "react-router-dom";
import { ArrowUpRight, Layers } from "lucide-react";
import type { ProjectBillingUsage } from "@/src/reqHandlers/billing/getBillingDetails.reqhandler";

interface ProjectsUsageTableProps {
  projects: ProjectBillingUsage[];
}

export function ProjectsUsageTable({ projects }: ProjectsUsageTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-neutral-500">// project breakdown</p>
          <h2 className="font-mono text-xl font-medium">Active Applications Usage</h2>
        </div>
        <span className="font-mono text-xs text-neutral-500">
          {projects.length} projects tracked
        </span>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 py-12 text-center">
          <Layers className="size-8 text-neutral-600 mb-3" />
          <p className="font-mono text-sm text-neutral-400">// no active deployments found</p>
          <p className="font-mono text-xs text-neutral-500 mt-1">
            Deploy a repository to start tracking active serverless compute time.
          </p>
          <Link
            to="/dashboard"
            className="mt-4 inline-flex items-center gap-2 border border-neutral-700 px-4 py-2 font-mono text-xs hover:bg-white hover:text-black transition-colors"
          >
            go to projects
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950">
          <table className="w-full text-left font-mono text-sm">
            <thead className="border-b border-neutral-800 bg-neutral-900/40 text-xs text-neutral-400 uppercase">
              <tr>
                <th className="py-3.5 px-6 font-medium">Project</th>
                <th className="py-3.5 px-6 font-medium">Status</th>
                <th className="py-3.5 px-6 font-medium">Active Time</th>
                <th className="py-3.5 px-6 font-medium">Rate</th>
                <th className="py-3.5 px-6 font-medium text-right">Current Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-neutral-900/30 transition-colors">
                  <td className="py-4 px-6">
                    <Link
                      to={`/projects/${proj.id}`}
                      className="font-medium text-white hover:underline flex items-center gap-2"
                    >
                      {proj.project_id}
                      <ArrowUpRight className="size-3 text-neutral-500" />
                    </Link>
                    <div className="text-xs text-neutral-500 mt-0.5">{proj.full_name}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${proj.status === "active"
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                          : proj.status === "building"
                            ? "bg-yellow-400"
                            : "bg-red-500"
                          }`}
                      />
                      <span className="text-xs uppercase text-neutral-400">{proj.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>{proj.active_hours.toFixed(1)} hrs</div>
                    <div className="text-xs text-neutral-500">
                      ({proj.active_seconds.toLocaleString()}s)
                    </div>
                  </td>
                  <td className="py-4 px-6 text-neutral-400">${proj.hourly_rate.toFixed(4)}/hr</td>
                  <td className="py-4 px-6 text-right font-medium text-white">
                    ${proj.cost < 1 ? 0.02 : proj.cost.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
