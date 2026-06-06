import React, { useState, type Dispatch } from "react";
import { Link } from "react-router-dom";
import { GitBranch, Clock, X, Search, ChevronRight, Plus, Trash2, Link2, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loading } from "./ui/Loading";
import { GitHubIcon } from "@/src/components/GitHubIcon";
import { useFieldArray, useForm } from "react-hook-form";
import { deployProject, type DeployProjectRequest } from "../reqHandlers/project";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getStateHandler } from "../reqHandlers/project/getState.reqhandler";
import { getGithubInstalledReposHandler, type GithubRepository } from "../reqHandlers/project/getGithubInstalledApps";
import { checkRepoNameAvailabilityHandler } from "../reqHandlers/project/checkRepoNameAvailability.reqhandler";
import { getAllDeployedProjectsHandler, type Project } from "../reqHandlers/project/getAllDeployedProjects.reqhandler";
import { convertUTCToLocal } from "../utils/utcToLocal";

function ProjectCard({ project }: { project: Project }) {

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/10 p-6 backdrop-blur-sm transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-900/60 hover:shadow-2xl hover:shadow-white/5"
    >
      {/* Subtle background glow on hover */}
      <div className="absolute -right-4 -top-4 size-32 bg-white/5 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-mono text-lg font-medium tracking-tight text-white transition-colors group-hover:text-white/90">
              {project.project_id}
            </h3>
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                {project.status === "building" && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400/75 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex size-2.5 rounded-full ${project.status === "active"
                    ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                    : project.status === "building"
                      ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"
                      : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                    }`}
                />
              </span>
              <span className="font-mono text-[10px] uppercase text-neutral-500">
                {project.status}
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
            <span className="text-neutral-600">https://</span>
            {`${project.project_id}.shipr.dev`}
          </div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl  transition-all duration-300">
          <SquareArrowOutUpRight className="size-4 text-neutral-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 border-t border-neutral-800/50 pt-5 justify-items-center">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-neutral-500">
            <GitBranch className="size-3.5" />
            <span className="font-mono text-[10px] uppercase">branch</span>
          </div>
          <p className="font-mono text-xs font-medium text-neutral-300 truncate">
            {project.branch}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-neutral-500">
            <GitHubIcon className="size-3.5" />
            <span className="font-mono text-[10px] uppercase">repo</span>
          </div>
          <p className="font-mono text-xs font-medium text-neutral-300 truncate" title={project.full_name}>
            {project.full_name}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-neutral-500">
            <Clock className="size-3.5" />
            <span className="font-mono text-[10px] uppercase">updated</span>
          </div>
          <p className="font-mono text-xs font-medium text-neutral-300">
            {convertUTCToLocal(project.last_deployment_time)}
          </p>
        </div>
      </div>
    </Link>)
}

export function ProjectsPage() {
  const [showModal, setShowModal] = useState(false);
  const [showGithubInstalledRepo, setShowGithubInstalledRepo] = useState(false);
  const [repo, setRepo] = useState<GithubRepository | null>(null);

  const { data } = useQuery({
    queryKey: ["state"],
    queryFn: getStateHandler
  })

  const { data: projectsArr, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllDeployedProjectsHandler
  })

  const handleDeployClick = () => {
    window.open(`https://github.com/apps/shipr-deployment/installations/new?state=${data?.state}`, "_blank");
    setShowGithubInstalledRepo(true);
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
                {projectsArr?.projects.length} projects deployed
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

          {isLoading && <Loading className="flex items-center justify-center" title="fetching projects..." />}

          {/* Projects Grid */}
          <div className="mt-12 grid gap-4">
            {projectsArr?.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Empty State (commented out for now, shown when no projects) */}
          {projectsArr?.projects.length === 0 && (
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
            <DeployModal repo={repo} setShowModal={setShowModal} />
          </div>
        </div>
      )}

      {showGithubInstalledRepo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md border border-neutral-800 bg-black p-8 overflow-y-scroll max-h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm text-neutral-500">// new deployment</p>
              <button
                onClick={() => { setShowGithubInstalledRepo(false); setShowModal(false) }}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <h2 className="mt-4 font-mono text-xl font-medium">Deploy Project</h2>
            <p className="mt-2 font-mono text-sm text-neutral-500">
              Select a repository to deploy
            </p>
            <GithubInstalledAppsModal setModalOpen={setShowModal} setShowGithubInstalledRepo={setShowGithubInstalledRepo} setRepo={setRepo} />
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
  root_dir: string;
  dist_dir: string;
  branch: string;
  installation_id: number;
  full_name: string;

  install_cmds?: CommandField[];
  build_cmds?: CommandField[];
  run_cmds?: CommandField[];
  envs?: { key: string; value: string }[];
}

export function DeployModal({ repo, setShowModal }: { repo: GithubRepository, setShowModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValidating },
  } = useForm<DeploymentFormData>({
    defaultValues: {
      name: "test_project",
      branch: "main",
      root_dir: "frontend/",
      dist_dir: "frontend/dist",
      installation_id: repo.installation_id,
      full_name: repo.full_name,

      install_cmds: [{ value: "npm install" }],
      build_cmds: [{ value: "npm run build" }],
      run_cmds: [{ value: "npm start" }],
      envs: [{ key: "PORT", value: "3000" }],
    },
    mode: "onBlur",
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

  // ENVS
  const {
    fields: envFields,
    append: appendEnv,
    remove: removeEnv,
  } = useFieldArray({
    control,
    name: "envs",
  });


  const deployMutation = useMutation({
    mutationFn: deployProject,
    onSuccess: (data) => {
      setShowModal(false);
      console.log("sucess");
    },
    onError: (error) => {
      console.log("error", error);
    }
  })

  const handleOnSubmit = async (data: DeploymentFormData) => {
    try {
      const payload: DeployProjectRequest = {
        project_id: data.name,
        install_cmds: data.install_cmds?.map((cmd) => cmd.value) || [],
        build_cmds: data.build_cmds?.map((cmd) => cmd.value) || [],
        run_cmds: data.run_cmds?.map((cmd) => cmd.value) || [],
        envs: data.envs?.filter(env => env.key.trim() !== "") || [],
        branch: data.branch,
        dist_dir: data.dist_dir,
        root_dir: data.root_dir,
        full_name: data.full_name,
        installation_id: data.installation_id,
      };

      console.log("payload", payload);

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

        <div className="relative">
          <Input
            placeholder="my-app"
            className="mt-2"
            {...register("name", {
              required: "Project name is required",
              validate: async (value) => {
                if (!value) return true;
                try {
                  const res = await checkRepoNameAvailabilityHandler({ project_name: value });
                  return res.is_available || "Project name is already taken";
                } catch (error) {
                  return "Error checking name availability";
                }
              }
            })}
          />
          {isValidating && (
            <div className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-500 border-t-transparent" />
            </div>
          )}
        </div>

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
          // root_dir
        </label>

        <Input
          placeholder="/"
          className="mt-2"
          {...register("root_dir", {
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
                {...register(`install_cmds.${index}.value`)}
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
                {...register(`build_cmds.${index}.value`)}
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
                {...register(`run_cmds.${index}.value`)}
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

      {/* ENVS */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="font-mono text-xs text-neutral-500">
            // envs
          </label>

          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => appendEnv({ key: "", value: "" })}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {envFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                placeholder="KEY"
                className="flex-1"
                {...register(`envs.${index}.key`)}
              />
              <Input
                placeholder="VALUE"
                className="flex-1"
                {...register(`envs.${index}.value`)}
              />

              {envFields.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => removeEnv(index)}
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

type GithubInstalledAppsModalProps = {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setShowGithubInstalledRepo: React.Dispatch<React.SetStateAction<boolean>>
  setRepo: React.Dispatch<React.SetStateAction<GithubRepository>>
}
export function GithubInstalledAppsModal({ setModalOpen, setShowGithubInstalledRepo, setRepo }: GithubInstalledAppsModalProps) {
  // const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ['githubInstalledApps'],
    queryFn: getGithubInstalledReposHandler,
  });

  console.log(data);

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
        <Input
          placeholder="Search repositories..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div> */}

      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <Loading title="fetching repositories..." />
        ) : error ? (
          <div className="border border-red-900/50 bg-red-900/10 p-4 rounded-lg">
            <p className="font-mono text-xs text-red-400 leading-relaxed uppercase tracking-wider mb-1">Error detected</p>
            <p className="font-mono text-sm text-red-200">{(error as Error).message}</p>
          </div>
        ) : data.repos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
            <p className="font-mono text-sm leading-relaxed">no repositories found</p>
            {/* {searchQuery && (
              <Button
                variant="link"
                className="mt-2 text-neutral-400 hover:text-white"
                onClick={() => setSearchQuery("")}
              >
                clear search
              </Button>
            )} */}
          </div>
        ) : (
          data.repos.map((repo: GithubRepository) => (
            <button
              key={repo.installation_id + "-" + repo.id}
              className="group w-full cursor-pointer flex items-center justify-between p-4 border border-neutral-900 bg-neutral-950/50 hover:border-neutral-700 hover:bg-neutral-900 transition-all text-left rounded-lg"
              onClick={() => { setModalOpen(true); setShowGithubInstalledRepo(false); setRepo(repo) }}
            >
              <div className="flex items-center gap-4">
                <div className="size-10 flex items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-neutral-600 transition-colors">
                  <GitHubIcon className="size-5 text-neutral-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-mono text-sm font-medium text-neutral-200 group-hover:text-white transition-colors capitalize">
                    {repo.name.replace(/-/g, ' ')}
                  </h4>
                  <p className="font-mono text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors">
                    {repo.full_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] uppercase text-neutral-500">
                  Select
                </span>
                <ChevronRight className="size-4 text-neutral-700 group-hover:text-neutral-400 transition-colors" />
              </div>
            </button>
          ))
        )}
      </div>

      <div className="pt-4 border-t border-neutral-900">
        <p className="font-mono text-[10px] text-neutral-500 text-center leading-relaxed">
          Don't see your repository?{' '}
          <a
            href="https://github.com/apps/shipr-deployment/installations/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-white underline underline-offset-4"
          >
            Adjust GitHub App Permissions
          </a>
        </p>
      </div>
    </div>
  );
}