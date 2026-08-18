"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Trash2, Maximize2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { EmptyState } from "@/components/empty-state"
import { useVehiclePhotos, useUploadVehiclePhoto, useDeleteVehiclePhoto } from "../hooks/use-vehicles"
import { ImageIcon } from "lucide-react"

interface VehiclePhotoGalleryProps {
  vehicleId: string
}

export function VehiclePhotoGallery({ vehicleId }: VehiclePhotoGalleryProps) {
  const { data: photos, isLoading } = useVehiclePhotos(vehicleId)
  const uploadMutation = useUploadVehiclePhoto(vehicleId)
  const deleteMutation = useDeleteVehiclePhoto(vehicleId)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const handleUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.multiple = true
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        Array.from(files).forEach((file) => {
          uploadMutation.mutate({ file })
        })
      }
    }
    input.click()
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Photos</CardTitle>
        <Button size="sm" onClick={handleUpload} disabled={uploadMutation.isPending}>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </CardHeader>
      <CardContent>
        {!photos || photos.length === 0 ? (
          <EmptyState
            icon={<ImageIcon className="h-8 w-8" />}
            title="No photos"
            description="Upload photos to showcase this vehicle"
            action={
              <Button size="sm" onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload photos
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square overflow-hidden rounded-lg border"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || "Vehicle photo"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => setSelectedPhoto(photo.url)}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => deleteMutation.mutate(photo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl border-0 bg-transparent p-0 shadow-none">
            {selectedPhoto && (
              <img
                src={selectedPhoto}
                alt="Vehicle photo"
                className="w-full rounded-lg object-contain"
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
