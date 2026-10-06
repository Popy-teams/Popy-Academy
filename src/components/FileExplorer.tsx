import { useEffect, useMemo, useState } from "react"
import {
  FileText,
  Folder,
  FolderPlus,
  MoreHorizontal,
  RotateCcw,
  Search,
  Trash2,
  Upload,
} from "lucide-react"

import { usePersistentState } from "../lib/persistence"

type WorkspaceFile = {
  id: number
  name: string
  folder: string
  deleted: boolean
  type: "file" | "folder"
}

export default function FileExplorer({
  onCountChange,
}: {
  onCountChange?: (count: number) => void
}) {
  const [items, setItems] = usePersistentState<WorkspaceFile[]>(
    "child-file-explorer",
    [
      {
        id: 1,
        name: "Mathématiques",
        folder: "/",
        deleted: false,
        type: "folder",
      },
      { id: 2, name: "Français", folder: "/", deleted: false, type: "folder" },
      {
        id: 3,
        name: "Leçon-fractions.pdf",
        folder: "Mathématiques",
        deleted: false,
        type: "file",
      },
      {
        id: 4,
        name: "Poésie-mai.txt",
        folder: "Français",
        deleted: false,
        type: "file",
      },
    ],
  )
  const [currentFolder, setCurrentFolder] = useState("/")
  const [search, setSearch] = useState("")
  const [showTrash, setShowTrash] = useState(false)

  const visibleItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.deleted === showTrash &&
          (showTrash || item.folder === currentFolder) &&
          item.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [currentFolder, items, search, showTrash],
  )

  useEffect(() => {
    onCountChange?.(items.filter((item) => !item.deleted).length)
  }, [items, onCountChange])

  const addFolder = () => {
    const name = window.prompt("Nom du nouveau dossier")
    if (!name?.trim()) return
    setItems([
      ...items,
      {
        id: Date.now(),
        name: name.trim(),
        folder: currentFolder,
        deleted: false,
        type: "folder",
      },
    ])
  }

  const rename = (item: WorkspaceFile) => {
    const name = window.prompt("Nouveau nom", item.name)
    if (!name?.trim()) return
    setItems(
      items.map((current) =>
        current.id === item.id ? { ...current, name: name.trim() } : current,
      ),
    )
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-xs font-bold outline-none focus:border-cyan-300"
            placeholder="Rechercher un document..."
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={addFolder}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600"
          >
            <FolderPlus size={16} /> Dossier
          </button>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-600 px-3 py-2 text-xs font-black text-white">
            <Upload size={16} /> Fichier
            <input
              type="file"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                setItems([
                  ...items,
                  {
                    id: Date.now(),
                    name: file.name,
                    folder: currentFolder,
                    deleted: false,
                    type: "file",
                  },
                ])
              }}
            />
          </label>
          <button
            onClick={() => setShowTrash(!showTrash)}
            className={`grid size-10 place-items-center rounded-xl ${
              showTrash
                ? "bg-rose-100 text-rose-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-black text-slate-400">
        <button
          onClick={() => {
            setCurrentFolder("/")
            setShowTrash(false)
          }}
          className="text-cyan-700"
        >
          Mes documents
        </button>
        {!showTrash && currentFolder !== "/" && (
          <>
            <span>/</span>
            <span>{currentFolder}</span>
          </>
        )}
        {showTrash && (
          <>
            <span>/</span>
            <span>Corbeille</span>
          </>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => (
          <article
            key={item.id}
            className="group relative rounded-2xl border border-slate-200 bg-white p-4 hover:border-cyan-300"
          >
            <button
              onClick={() =>
                item.type === "folder" && setCurrentFolder(item.name)
              }
              className="w-full text-left"
            >
              <span
                className={`grid size-11 place-items-center rounded-xl ${
                  item.type === "folder"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-cyan-50 text-cyan-600"
                }`}
              >
                {item.type === "folder" ? (
                  <Folder size={21} fill="currentColor" />
                ) : (
                  <FileText size={21} />
                )}
              </span>
              <span className="mt-3 block truncate text-sm font-black text-slate-700">
                {item.name}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {item.type === "folder" ? "Dossier" : "Disponible hors ligne"}
              </span>
            </button>
            <button
              onClick={() =>
                showTrash
                  ? setItems(
                      items.map((current) =>
                        current.id === item.id
                          ? { ...current, deleted: false }
                          : current,
                      ),
                    )
                  : rename(item)
              }
              className="absolute right-12 top-4 grid size-8 place-items-center rounded-lg bg-slate-50 text-slate-400 opacity-0 transition group-hover:opacity-100"
            >
              {showTrash ? (
                <RotateCcw size={15} />
              ) : (
                <MoreHorizontal size={16} />
              )}
            </button>
            <button
              onClick={() =>
                setItems(
                  showTrash
                    ? items.filter((current) => current.id !== item.id)
                    : items.map((current) =>
                        current.id === item.id
                          ? { ...current, deleted: true }
                          : current,
                      ),
                )
              }
              className="absolute right-3 top-4 grid size-8 place-items-center rounded-lg bg-rose-50 text-rose-500 opacity-0 transition group-hover:opacity-100"
            >
              <Trash2 size={15} />
            </button>
          </article>
        ))}
      </div>

      {!visibleItems.length && (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-xs font-bold text-slate-400">
          {showTrash
            ? "La corbeille est vide."
            : "Aucun document dans ce dossier."}
        </div>
      )}
    </div>
  )
}
