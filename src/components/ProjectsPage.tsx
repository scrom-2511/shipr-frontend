import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, GitBranch, Clock, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GitHubIcon } from "@/src/components/GitHubIcon";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { deployProject } from "../reqHandlers/project";
import { useMutation } from "@tanstack/react-query";


interface Project {
  id: string;
  name: string;
  url: string;
  repo: string;
  branch: string;
  status: "active" | "building" | "error";
  lastDeployed: string;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "my-landing-page",
    url: "my-landing-page.shipr.dev",
    repo: "scrom/landing-page",
    branch: "main",
    status: "active",
    lastDeployed: "2 hours ago",
  },
  {
    id: "2",
    name: "api-dashboard",
    url: "api-dashboard.shipr.dev",
    repo: "scrom/api-dashboard",
    branch: "main",
    status: "building",
    lastDeployed: "5 mins ago",
  },
  {
    id: "3",
    name: "docs-site",
    url: "docs-site.shipr.dev",
    repo: "scrom/documentation",
    branch: "main",
    status: "active",
    lastDeployed: "1 day ago",
  },
  {
    id: "4",
    name: "portfolio",
    url: "scrom-portfolio.shipr.dev",
    repo: "scrom/portfolio",
    branch: "main",
    status: "active",
    lastDeployed: "3 days ago",
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block border border-neutral-800 p-6 hover:border-neutral-600 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-mono text-base font-medium">{project.name}</h3>
            <span
              className={`size-2 rounded-full ${project.status === "active"
                ? "bg-green-500"
                : project.status === "building"
                  ? "bg-yellow-500"
                  : "bg-red-500"
                }`}
            />
          </div>
          <p className="mt-1 font-mono text-sm text-neutral-500">
            {project.url}
          </p>
        </div>
        <ExternalLink className="size-4 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
      </div>

      <div className="mt-6 flex items-center gap-6 font-mono text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <GitBranch className="size-3" />
          <span>{project.branch}</span>
        </div>
        <div className="flex items-center gap-2">
          <GitHubIcon className="size-3" />
          <span>{project.repo}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-3" />
          <span>deployed {project.lastDeployed}</span>
        </div>
      </div>
    </Link>
  );
}

export function ProjectsPage() {
  const [showModal, setShowModal] = useState(false);

  const handleDeployClick = () => {
    window.open("https://github.com/apps/shipr-deployment/installations/new", "_blank");
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-900 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="font-mono text-lg font-medium tracking-tight">shipr</span>
          </Link>

          <div className="flex items-center gap-6 font-mono text-sm">
            <Link
              to="/dashboard"
              className="text-white hover:text-neutral-400 transition-colors"
            >
              projects
            </Link>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors">
              settings
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-sm text-neutral-500">
              <GitHubIcon className="size-4" />
              <span>scrom</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-sm text-neutral-500">// your projects</p>
              <h1 className="mt-4 font-mono text-3xl font-medium tracking-tight">
                All Projects
              </h1>
              <p className="mt-2 font-mono text-sm text-neutral-500">
                {mockProjects.length} projects deployed
              </p>
            </div>
            <Button
              variant="outline"
              size="default"
              className="border-neutral-700 font-mono text-sm hover:bg-white hover:text-black"
              onClick={handleDeployClick}
            >
              <Plus className="size-4" />
              deploy new project
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Empty State (commented out for now, shown when no projects) */}
          {mockProjects.length === 0 && (
            <div className="mt-12 flex flex-col items-center justify-center border border-dashed border-neutral-800 py-24">
              <p className="font-mono text-sm text-neutral-500">
                // no projects yet
              </p>
              <p className="mt-4 font-mono text-lg">deploy your first project</p>
              <Button
                variant="outline"
                size="default"
                className="mt-6 border-neutral-700 font-mono text-sm hover:bg-white hover:text-black"
                onClick={handleDeployClick}
              >
                <Plus className="size-4" />
                deploy new project
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Deploy Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md border border-neutral-800 bg-black p-8 overflow-y-scroll max-h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm text-neutral-500">// new deployment</p>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <h2 className="mt-4 font-mono text-xl font-medium">Deploy Project</h2>
            <p className="mt-2 font-mono text-sm text-neutral-500">
              Install the GitHub app and configure your deployment commands.
            </p>
            <DeployModal />
          </div>
        </div>
      )}
    </div>
  );
}

type CommandField = {
  value: string;
};

interface DeploymentFormData {
  name: string;
  home_dir: string;
  dist_dir: string;
  branch: string;

  install_cmds: CommandField[];
  build_cmds: CommandField[];
  run_cmds: CommandField[];
}

export function DeployModal() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeploymentFormData>({
    defaultValues: {
      name: "",
      branch: "main",
      home_dir: "/",
      dist_dir: "/dist",

      install_cmds: [{ value: "npm install" }],
      build_cmds: [{ value: "npm run build" }],
      run_cmds: [{ value: "npm start" }],
    },
  });

  // INSTALL COMMANDS
  const {
    fields: installFields,
    append: appendInstall,
    remove: removeInstall,
  } = useFieldArray({
    control,
    name: "install_cmds",
  });

  // BUILD COMMANDS
  const {
    fields: buildFields,
    append: appendBuild,
    remove: removeBuild,
  } = useFieldArray({
    control,
    name: "build_cmds",
  });

  // RUN COMMANDS
  const {
    fields: runFields,
    append: appendRun,
    remove: removeRun,
  } = useFieldArray({
    control,
    name: "run_cmds",
  });


  let deployMutation = useMutation({
    mutationFn: deployProject,
    onSuccess: (data) => {
      console.log("sucess");
    },
    onError: (error) => {
      console.log("error");
    }
  })

  const handleOnSubmit = async (data: DeploymentFormData) => {
    try {
      const payload = {
        ...data,
        install_cmds: data.install_cmds.map((cmd) => cmd.value),
        build_cmds: data.build_cmds.map((cmd) => cmd.value),
        run_cmds: data.run_cmds.map((cmd) => cmd.value),
      };

      deployMutation.mutate(payload);

      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleOnSubmit)}
      className="mt-8 space-y-6"
    >
      {/* NAME */}
      <div>
        <label className="block font-mono text-xs text-neutral-500">
          // project_name
        </label>

        <Input
          placeholder="my-app"
          className="mt-2"
          {...register("name", {
            required: "Project name is required",
          })}
        />

        {errors.name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* BRANCH */}
      <div>
        <label className="block font-mono text-xs text-neutral-500">
          // branch
        </label>

        <Input
          placeholder="main"
          className="mt-2"
          {...register("branch", {
            required: "Branch is required",
          })}
        />
      </div>

      {/* HOME DIR */}
      <div>
        <label className="block font-mono text-xs text-neutral-500">
          // home_dir
        </label>

        <Input
          placeholder="/"
          className="mt-2"
          {...register("home_dir", {
            required: "Home dir is required",
          })}
        />
      </div>

      {/* DIST DIR */}
      <div>
        <label className="block font-mono text-xs text-neutral-500">
          // dist_dir
        </label>

        <Input
          placeholder="/dist"
          className="mt-2"
          {...register("dist_dir", {
            required: "Dist dir is required",
          })}
        />
      </div>

      {/* INSTALL COMMANDS */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="font-mono text-xs text-neutral-500">
            // install_cmds
          </label>

          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => appendInstall({ value: "" })}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {installFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                placeholder="npm install"
                {...register(`install_cmds.${index}.value` as const, {
                  required: "Install command is required",
                })}
              />

              {installFields.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => removeInstall(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BUILD COMMANDS */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="font-mono text-xs text-neutral-500">
            // build_cmds
          </label>

          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => appendBuild({ value: "" })}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {buildFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                placeholder="npm run build"
                {...register(`build_cmds.${index}.value` as const, {
                  required: "Build command is required",
                })}
              />

              {buildFields.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => removeBuild(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RUN COMMANDS */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="font-mono text-xs text-neutral-500">
            // run_cmds
          </label>

          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => appendRun({ value: "" })}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {runFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                placeholder="npm start"
                {...register(`run_cmds.${index}.value` as const, {
                  required: "Run command is required",
                })}
              />

              {runFields.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => removeRun(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-white text-black"
      >
        {isSubmitting ? "Deploying..." : "Deploy"}
      </Button>
    </form>
  );
}