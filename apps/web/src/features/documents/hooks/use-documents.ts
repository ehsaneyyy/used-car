"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getDocuments, uploadDocument, deleteDocument } from "../api/documents-api"

export function useDocuments(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["documents", params],
    queryFn: () => getDocuments(params),
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      vehicleId,
      file,
      name,
    }: {
      vehicleId: string
      file: File
      name: string
    }) => uploadDocument(vehicleId, file, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] })
      toast.success("Document uploaded")
    },
    onError: () => {
      toast.error("Failed to upload document")
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] })
      toast.success("Document deleted")
    },
  })
}
