import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, GitBranch, Clock, Save, RotateCcw, GitCommit, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GitHubIcon } from "@/src/components/GitHubIcon";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjectDetailHandler } from "../reqHandlers/project/getProjectDetail.reqhandler";
import { updateProjectDetailHandler } from "../reqHandlers/project/updateProjectDetail.reqhandler";
import { convertUTCToLocal } from "../utils/utcToLocal";
import { Loading } from "./ui/Loading";
import { TrafficGraph } from "./TrafficGraph";


type CommandField = {
  value: string;
};

interface ProjectFormData {
  name: string;
  branch: string;
  home_dir: string;
  dist_dir: string;
  install_cmds: CommandField[];
  build_cmds: CommandField[];
  run_cmds: CommandField[];
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  // const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectDetailHandler(id!),
    enabled: !!id,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<ProjectFormData>();

  // Sync form with project data
  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        branch: project.branch,
        home_dir: project.home_dir,
        dist_dir: project.dist_dir,
        install_cmds: project.install_cmds.map((cmd) => ({ value: cmd })),
        build_cmds: project.build_cmds.map((cmd) => ({ value: cmd })),
        run_cmds: project.run_cmds.map((cmd) => ({ value: cmd })),
      });
    }
  }, [project, reset]);

  // Mutations
  const updateMutation = useMutation({
    mutationFn: updateProjectDetailHandler,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      // setIsEditing(false);
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

  const handleCancel = () => {
    if (project) {
      reset({
        name: project.name,
        branch: project.branch,
        home_dir: project.home_dir,
        dist_dir: project.dist_dir,
        install_cmds: project.install_cmds.map((cmd) => ({ value: cmd })),
        build_cmds: project.build_cmds.map((cmd) => ({ value: cmd })),
        run_cmds: project.run_cmds.map((cmd) => ({ value: cmd })),
      });
    }
    // setIsEditing(false);
  };

  const handleOnSubmit = async (data: ProjectFormData) => {
    if (!id) return;
    try {
      const payload = {
        project_id: id,
        name: data.name,
        branch: data.branch,
        home_dir: data.home_dir,
        dist_dir: data.dist_dir,
        install_cmds: data.install_cmds.map((cmd) => cmd.value),
        build_cmds: data.build_cmds.map((cmd) => cmd.value),
        run_cmds: data.run_cmds.map((cmd) => cmd.value),
      };

      await updateMutation.mutateAsync(payload);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loading title="Fetching project details..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <p className="font-mono text-red-500">// error loading project</p>
        <p className="mt-2 text-neutral-400">{(error as Error)?.message || "Project not found"}</p>
        <Link to="/dashboard" className="mt-6 text-sm text-white hover:underline">
          back to projects
        </Link>
      </div>
    );
  }

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
                  <span>{project.commit_hash}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-3" />
                  <span>{convertUTCToLocal(project.last_deployment_time)}</span>
                </div>
              </div>
            </div>

            {/* {isEditing ? (
              <Button
                variant="outline"
                size="default"
                className="border-neutral-700 font-mono text-sm hover:bg-white hover:text-black w-fit"
              // onClick={() => setIsEditing(true)}
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
                  disabled={isFormSubmitting || updateMutation.isPending}
                  className="bg-white font-mono text-sm text-black hover:bg-neutral-200"
                >
                  <Save className="size-4" />
                  {isFormSubmitting || updateMutation.isPending ? "saving..." : "save"}
                </Button>
              </div>
            )} */}
          </div>

          {/* Project URL */}
          <div className="mt-8">
            <a
              href={`https://${project.name}.shipr.dev`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-mono text-sm text-white hover:text-neutral-400 transition-colors"
            >
              {`${project.name}.shipr.dev`}
              <ExternalLink className="size-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>


          {/* Edit Form */}
          {false ? (
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
                  className="mt-2 text-white"
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
                  className="mt-2 text-white"
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
                  className="mt-2 text-white"
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
                  className="mt-2 text-white"
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
                        className="text-white"
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
                        className="text-white"
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
                        className="text-white"
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
                  <span>{project.full_name}</span>
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
          {/* Traffic Graph */}
          <TrafficGraph />
        </div>
      </main>
    </div>
  );
}