import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ACCEPTED_TYPES, MAX_MB, uploadDocument, validateFile } from "@/services/documents";

type Item = { name: string; progress: number; error?: string };

export function UploadZone({ onUploaded, inputRef }: { onUploaded: (id: string) => void; inputRef?: React.RefObject<HTMLInputElement | null> }) {
  const [drag, setDrag] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const localRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? localRef;

  const handle = (files: FileList | null) => {
    if (!files?.length) return;
    Array.from(files).forEach((file) => {
      const err = validateFile(file);
      if (err) {
        setItems((s) => [{ name: file.name, progress: 0, error: err }, ...s]);
        toast.error(`Upload failed: ${file.name}`, { description: err });
        return;
      }
      setItems((s) => [{ name: file.name, progress: 0 }, ...s]);
      let p = 0;
      const t = setInterval(async () => {
        p += 18 + Math.random() * 20;
        setItems((s) => s.map((i) => (i.name === file.name ? { ...i, progress: Math.min(p, 100) } : i)));
        if (p >= 100) {
          clearInterval(t);
          const doc = await uploadDocument(file, { department: "Planning & Statistics", category: "Uploaded" });
          toast.success(`${file.name} uploaded`, { description: "Processing pipeline started." });
          setItems((s) => s.filter((i) => i.name !== file.name));
          onUploaded(doc.id);
        }
      }, 220);
    });
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
        onClick={() => ref.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && ref.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card px-6 py-9 text-center transition-colors",
          drag ? "border-primary bg-accent/50" : "hover:border-primary/50",
        )}
      >
        <UploadCloud className={cn("mb-3 h-8 w-8 text-muted-foreground transition-transform", drag && "scale-110 text-primary")} />
        <div className="text-sm font-medium">Drag & drop files here, or click to browse</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {ACCEPTED_TYPES.join(" • ")} — up to {MAX_MB} MB each
        </div>
        <input ref={ref} type="file" multiple hidden accept={ACCEPTED_TYPES.map((t) => `.${t.toLowerCase()}`).join(",")} onChange={(e) => { handle(e.target.files); e.target.value = ""; }} />
      </div>
      {items.length > 0 && (
        <ul className="mt-3 space-y-2">
          {items.map((i) => (
            <li key={i.name} className={cn("flex items-center gap-3 rounded-lg border bg-card px-3 py-2 text-sm", i.error && "border-destructive/30 bg-destructive/5")}>
              <span className="min-w-0 flex-1 truncate">{i.name}</span>
              {i.error ? (
                <>
                  <span className="text-xs text-destructive">{i.error}</span>
                  <button aria-label="Dismiss" onClick={() => setItems((s) => s.filter((x) => x !== i))}><X className="h-4 w-4 text-muted-foreground" /></button>
                </>
              ) : (
                <Progress value={i.progress} className="h-1.5 w-40" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
