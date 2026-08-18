"use client"

import { useState } from "react"
import { Plus, FileText, Upload, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useDocuments,
  useUploadDocument,
  useDeleteDocument,
} from "@/features/documents/hooks/use-documents"
import { formatDate } from "@/lib/utils"

export default function DocumentsPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [vehicleId, setVehicleId] = useState("")
  const [docName, setDocName] = useState("")
  const { data, isLoading } = useDocuments({ per_page: 50 })
  const uploadMutation = useUploadDocument()
  const deleteMutation = useDeleteDocument()

  const handleUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file && vehicleId && docName) {
        uploadMutation.mutate(
          { vehicleId, file, name: docName },
          {
            onSuccess: () => {
              setShowUpload(false)
              setVehicleId("")
              setDocName("")
            },
          }
        )
      }
    }
    input.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Manage all your vehicle documents"
        action={{
          label: "Upload Document",
          onClick: () => setShowUpload(true),
          icon: <Upload className="h-4 w-4" />,
        }}
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : !data?.items || data.items.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No documents"
          description="Upload documents like titles, registrations, and inspection reports"
          action={
            <Button onClick={() => setShowUpload(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((doc) => (
            <div
              key={doc.id}
              className="group flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-md"
            >
              <div className="rounded-lg bg-muted p-2.5">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{doc.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px]">
                    {doc.type.toUpperCase()}
                  </Badge>
                  <span>{formatFileSize(doc.file_size)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(doc.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => window.open(doc.file_url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => deleteMutation.mutate(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Vehicle ID</label>
              <Input
                placeholder="Enter vehicle ID"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Document Name</label>
              <Input
                placeholder="e.g. Title, Registration"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowUpload(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!vehicleId || !docName || uploadMutation.isPending}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
