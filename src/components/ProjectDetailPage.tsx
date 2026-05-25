import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, GitBranch, Clock, Save, RotateCcw, GitCommit } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GitHubIcon } from "@/src/components/GitHubIcon";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

interface ProjectDetail {
  id: string;
  name: string;
  url: string;
  repo: string;
  branch: string;
  home_dir: string;
  dist_dir: string;
  install_cmds: string[];
  build_cmds: string[];
  run_cmds: string[];
  status: "active" | "building" | "error";
  lastDeployed: string;
  lastDeploymentTime: string;
  commitHash: string;
}

const mockProjectDetail: ProjectDetail = {
  id: "1",
  name: "my-landing-page",
  url: "my-landing-page.shipr.dev",
  repo: "scrom/landing-page",
  branch: "main",
  home_dir: "/",
  dist_dir: "/dist",
  install_cmds: ["npm install"],
  build_cmds: ["npm run build"],
  run_cmds: ["npm start"],
  status: "active",
  lastDeployed: "2 hours ago",
  lastDeploymentTime: "2026-05-14T10:30:00Z",
  commitHash: "a1b2c3d4e5f6",
};

type CommandField = {
  value: string;
};

interface ProjectFormData {
  name: string;
  url: string;
  home_dir: string;
  dist_dir: string;
  branch: string;
  install_cmds: CommandField[];
  build_cmds: CommandField[];
  run_cmds: CommandField[];
}

export function ProjectDetailPage() {
  useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: mockProjectDetail.name,
      url: mockProjectDetail.url,
      branch: mockProjectDetail.branch,
      home_dir: mockProjectDetail.home_dir,
      dist_dir: mockProjectDetail.dist_dir,
      install_cmds: mockProjectDetail.install_cmds.map((cmd) => ({ value: cmd })),
      build_cmds: mockProjectDetail.build_cmds.map((cmd) => ({ value: cmd })),
      run_cmds: mockProjectDetail.run_cmds.map((cmd) => ({ value: cmd })),
    },
  });

  // Install commands
  const {
    fields: installFields,
    append: appendInstall,
    remove: removeInstall,
  } = useFieldArray({
    control,
    name: "install_cmds",
  });

  // Build commands
  const {
    fields: buildFields,
    append: appendBuild,
    remove: removeBuild,
  } = useFieldArray({
    control,
    name: "build_cmds",
  });

  // Run commands
  const {
    fields: runFields,
    append: appendRun,
    remove: removeRun,
  } = useFieldArray({
    control,
    name: "run_cmds",
  });

  const project = mockProjectDetail;

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleOnSubmit = async (data: ProjectFormData) => {
    try {
      const payload = {
        ...data,
        install_cmds: data.install_cmds.map((cmd) => cmd.value),
        build_cmds: data.build_cmds.map((cmd) => cmd.value),
        run_cmds: data.run_cmds.map((cmd) => cmd.value),
      };

      console.log("Submitting:", payload);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-900 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link to="/dashboard" className="flex items-center gap-3">
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
          {/* Back Link */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 font-mono text-sm text-neutral-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            back to projects
          </Link>

          {/* Header */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-sm text-neutral-500">// project details</p>
              <h1 className="mt-2 font-mono text-2xl font-medium tracking-tight sm:text-3xl">
                {project.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2 rounded-full ${project.status === "active"
                      ? "bg-green-500"
                      : project.status === "building"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      }`}
                  />
                  <span>{project.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="size-3" />
                  <span>{project.branch}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitCommit className="size-3" />
                  <span>{project.commitHash}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-3" />
                  <span>{project.lastDeploymentTime}</span>
                </div>
              </div>
            </div>

            {!isEditing ? (
              <Button
                variant="outline"
                size="default"
                className="border-neutral-700 font-mono text-sm hover:bg-white hover:text-black w-fit"
                onClick={() => setIsEditing(true)}
              >
                edit project
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="default"
                  className="border-neutral-700 font-mono text-sm hover:bg-neutral-800"
                  onClick={handleCancel}
                >
                  <RotateCcw className="size-4" />
                  cancel
                </Button>
                <Button
                  onClick={handleSubmit(handleOnSubmit)}
                  disabled={isSubmitting}
                  className="bg-white font-mono text-sm text-black hover:bg-neutral-200"
                >
                  <Save className="size-4" />
                  {isSubmitting ? "saving..." : "save"}
                </Button>
              </div>
            )}
          </div>

          {/* Project URL */}
          <div className="mt-8 mb-22">
            <a
              href={`https://${project.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-mono text-sm text-white hover:text-neutral-400 transition-colors"
            >
              {project.url}
              <ExternalLink className="size-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Edit Form */}
          {isEditing ? (
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

              {/* URL */}
              <div>
                <label className="block font-mono text-xs text-neutral-500">
                  // url
                </label>
                <Input
                  className="mt-2"
                  {...register("url", {
                    required: "URL is required",
                  })}
                />
                {errors.url && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.url.message}
                  </p>
                )}
              </div>

              {/* BRANCH */}
              <div>
                <label className="block font-mono text-xs text-neutral-500">
                  // branch
                </label>
                <Input
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
                    <Plus className="size-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {installFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
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
                          <Trash2 className="size-4" />
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
                    <Plus className="size-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {buildFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
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
                          <Trash2 className="size-4" />
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
                    <Plus className="size-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {runFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
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
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="mt-8 space-y-10 max-w-5xl">
              {/* Repository Info */}
              <div>
                <label className="block font-mono text-xs text-neutral-500">
                  // repository
                </label>
                <div className="mt-2 flex items-center gap-2 font-mono text-sm">
                  <GitHubIcon className="size-4 text-neutral-500" />
                  <span>{project.repo}</span>
                </div>
              </div>

              {/* Branch & Paths */}
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <label className="block font-mono text-xs text-neutral-500">
                    // branch
                  </label>
                  <p className="mt-2 font-mono text-sm">{project.branch}</p>
                </div>
                <div className="text-center">
                  <label className="block font-mono text-xs text-neutral-500">
                    // home_dir
                  </label>
                  <p className="mt-2 font-mono text-sm">{project.home_dir}</p>
                </div>
                <div className="text-right">
                  <label className="block font-mono text-xs text-neutral-500">
                    // dist_dir
                  </label>
                  <p className="mt-2 font-mono text-sm">{project.dist_dir}</p>
                </div>
              </div>

              {/* Commands */}
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <label className="block font-mono text-xs text-neutral-500">
                    // install_cmds
                  </label>
                  <div className="mt-2 space-y-1">
                    {project.install_cmds.map((cmd, i) => (
                      <p key={i} className="font-mono text-sm text-neutral-400">
                        {cmd}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <label className="block font-mono text-xs text-neutral-500">
                    // build_cmds
                  </label>
                  <div className="mt-2 space-y-1">
                    {project.build_cmds.map((cmd, i) => (
                      <p key={i} className="font-mono text-sm text-neutral-400">
                        {cmd}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <label className="block font-mono text-xs text-neutral-500">
                    // run_cmds
                  </label>
                  <div className="mt-2 space-y-1">
                    {project.run_cmds.map((cmd, i) => (
                      <p key={i} className="font-mono text-sm text-neutral-400">
                        {cmd}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}