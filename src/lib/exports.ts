export function toCsv(
  rows: Array<Record<string, string | number | boolean | null>>,
) {
  if (!rows.length) return ""
  const headers = Object.keys(rows[0])
  const escape = (value: unknown) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`

  return [
    headers.map(escape).join(","),
    ...rows.map((row) =>
      headers.map((header) => escape(row[header])).join(","),
    ),
  ].join("\n")
}

export function downloadTextFile(
  filename: string,
  content: string,
  type = "text/plain;charset=utf-8",
) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportJson(filename: string, data: unknown) {
  downloadTextFile(filename, JSON.stringify(data, null, 2), "application/json")
}

export function printCurrentView() {
  window.print()
}
