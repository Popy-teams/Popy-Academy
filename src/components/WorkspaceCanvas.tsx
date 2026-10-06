import { useEffect, useRef, useState } from "react"
import {
  Circle,
  Download,
  Eraser,
  Minus,
  PenTool,
  Redo2,
  RotateCcw,
  Save,
  Square,
  Undo2,
} from "lucide-react"

import { readLocalData, writeLocalData } from "../lib/offline-db"

type DrawingTool = "pen" | "eraser" | "line" | "rectangle" | "circle"

export default function WorkspaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const startPoint = useRef({ x: 0, y: 0 })
  const snapshot = useRef<ImageData | null>(null)
  const history = useRef<string[]>([])
  const historyIndex = useRef(-1)
  const [tool, setTool] = useState<DrawingTool>("pen")
  const [color, setColor] = useState("#22d3ee")
  const [lineWidth, setLineWidth] = useState(5)
  const [saved, setSaved] = useState(true)
  const [announcement, setAnnouncement] = useState("")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return
    context.fillStyle = "#0f172a"
    context.fillRect(0, 0, canvas.width, canvas.height)

    readLocalData<string>("child-workspace-canvas").then((stored) => {
      if (!stored) {
        pushHistory()
        return
      }
      loadImage(stored, false)
    })
  }, [])

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const bounds = canvas.getBoundingClientRect()
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
      y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
    }
  }

  const configureContext = (context: CanvasRenderingContext2D) => {
    context.lineCap = "round"
    context.lineJoin = "round"
    context.lineWidth = lineWidth
    context.strokeStyle = tool === "eraser" ? "#0f172a" : color
  }

  const beginDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return
    drawing.current = true
    startPoint.current = getPoint(event)
    snapshot.current = context.getImageData(0, 0, canvas.width, canvas.height)
    configureContext(context)
    context.beginPath()
    context.moveTo(startPoint.current.x, startPoint.current.y)
    canvas.setPointerCapture(event.pointerId)
    setSaved(false)
  }

  const continueDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return
    const point = getPoint(event)
    configureContext(context)

    if (tool === "pen" || tool === "eraser") {
      context.lineTo(point.x, point.y)
      context.stroke()
      return
    }

    if (snapshot.current) context.putImageData(snapshot.current, 0, 0)
    context.beginPath()
    if (tool === "line") {
      context.moveTo(startPoint.current.x, startPoint.current.y)
      context.lineTo(point.x, point.y)
    }
    if (tool === "rectangle") {
      context.rect(
        startPoint.current.x,
        startPoint.current.y,
        point.x - startPoint.current.x,
        point.y - startPoint.current.y,
      )
    }
    if (tool === "circle") {
      const radius = Math.hypot(
        point.x - startPoint.current.x,
        point.y - startPoint.current.y,
      )
      context.arc(
        startPoint.current.x,
        startPoint.current.y,
        radius,
        0,
        Math.PI * 2,
      )
    }
    context.stroke()
  }

  const endDrawing = () => {
    if (!drawing.current) return
    drawing.current = false
    pushHistory()
  }

  const pushHistory = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const image = canvas.toDataURL("image/png")
    history.current = history.current.slice(0, historyIndex.current + 1)
    history.current.push(image)
    if (history.current.length > 20) history.current.shift()
    historyIndex.current = history.current.length - 1
  }

  const loadImage = (source: string, addToHistory = true) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return
    const image = new Image()
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      if (addToHistory) pushHistory()
    }
    image.src = source
  }

  const undo = () => {
    if (historyIndex.current <= 0) return
    historyIndex.current -= 1
    loadImage(history.current[historyIndex.current], false)
    setSaved(false)
  }

  const redo = () => {
    if (historyIndex.current >= history.current.length - 1) return
    historyIndex.current += 1
    loadImage(history.current[historyIndex.current], false)
    setSaved(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return
    context.fillStyle = "#0f172a"
    context.fillRect(0, 0, canvas.width, canvas.height)
    pushHistory()
    setSaved(false)
  }

  const save = async () => {
    const source = canvasRef.current?.toDataURL("image/png")
    if (!source) return
    await writeLocalData("child-workspace-canvas", source)
    setSaved(true)
  }

  const download = () => {
    const source = canvasRef.current?.toDataURL("image/png")
    if (!source) return
    const link = document.createElement("a")
    link.download = "ardoise-popy.png"
    link.href = source
    link.click()
  }

  const placeShape = (shape: "rectangle" | "circle" | "line") => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    context.lineCap = "round"
    context.lineJoin = "round"
    context.lineWidth = lineWidth
    context.strokeStyle = color
    context.beginPath()
    if (shape === "rectangle") {
      context.rect(centerX - 80, centerY - 50, 160, 100)
    } else if (shape === "circle") {
      context.arc(centerX, centerY, 70, 0, Math.PI * 2)
    } else {
      context.moveTo(centerX - 100, centerY)
      context.lineTo(centerX + 100, centerY)
    }
    context.stroke()
    pushHistory()
    setSaved(false)
    setAnnouncement(`Forme ${shape} placée au centre sans geste.`)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {[
          ["pen", PenTool, "Crayon"],
          ["eraser", Eraser, "Gomme"],
          ["line", Minus, "Ligne"],
          ["rectangle", Square, "Rectangle"],
          ["circle", Circle, "Cercle"],
        ].map(([item, Icon, label]) => {
          const ToolIcon = Icon as typeof PenTool
          return (
            <button
              key={item as string}
              onClick={() => setTool(item as DrawingTool)}
              aria-label={label as string}
              aria-pressed={tool === item}
              className={`grid size-10 place-items-center rounded-xl ${
                tool === item
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <ToolIcon size={18} />
            </button>
          )
        })}
        <span className="mx-1 h-7 w-px bg-slate-200" />
        {["#22d3ee", "#f472b6", "#fbbf24", "#4ade80", "#ffffff"].map((item) => (
          <button
            key={item}
            onClick={() => setColor(item)}
            aria-label={`Couleur ${item}`}
            className={`size-8 rounded-full border-4 ${
              color === item ? "border-indigo-400" : "border-white"
            } shadow`}
            style={{ backgroundColor: item }}
          />
        ))}
        <label className="flex items-center gap-2 text-[10px] font-black text-slate-500">
          Épaisseur
          <input
            type="range"
            min="2"
            max="18"
            value={lineWidth}
            onChange={(event) => setLineWidth(Number(event.target.value))}
            className="w-24 accent-cyan-500"
            aria-label="Épaisseur du trait"
          />
        </label>
        <span className="flex-1" />
        <button
          onClick={undo}
          aria-label="Annuler"
          className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={redo}
          aria-label="Rétablir"
          className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600"
        >
          <Redo2 size={18} />
        </button>
        <button
          onClick={clearCanvas}
          aria-label="Effacer l’ardoise"
          className="grid size-10 place-items-center rounded-xl bg-rose-50 text-rose-600"
        >
          <RotateCcw size={18} />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => placeShape("rectangle")}
          className="rounded-xl bg-indigo-50 px-3 py-2 text-[10px] font-black text-indigo-700"
        >
          Placer un rectangle
        </button>
        <button
          onClick={() => placeShape("circle")}
          className="rounded-xl bg-indigo-50 px-3 py-2 text-[10px] font-black text-indigo-700"
        >
          Placer un cercle
        </button>
        <button
          onClick={() => placeShape("line")}
          className="rounded-xl bg-indigo-50 px-3 py-2 text-[10px] font-black text-indigo-700"
        >
          Placer une ligne
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={960}
        height={600}
        role="img"
        aria-label="Ardoise de dessin. Utilisez les boutons pour placer des formes sans geste."
        onPointerDown={beginDrawing}
        onPointerMove={continueDrawing}
        onPointerUp={endDrawing}
        onPointerCancel={endDrawing}
        className="mt-4 aspect-[8/5] w-full touch-none rounded-2xl border-4 border-slate-800 bg-slate-900"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-500" aria-live="polite">
          {announcement ||
            (saved ? "Ardoise enregistrée" : "Modifications non enregistrées")}
        </span>
        <div className="flex gap-2">
          <button
            onClick={download}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700"
          >
            <Download size={15} /> Image
          </button>
          <button
            onClick={save}
            className="flex items-center gap-2 rounded-xl bg-cyan-700 px-4 py-2 text-xs font-black text-white"
          >
            <Save size={15} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}
