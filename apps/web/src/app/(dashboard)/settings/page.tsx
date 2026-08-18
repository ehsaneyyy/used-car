"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { Loader2, Plus, Trash2 } from "lucide-react"
import {
  useOrganization,
  useUpdateOrganization,
  useBranches,
  useCreateBranch,
  useDeleteBranch,
} from "@/features/settings/hooks/use-settings"

const orgSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
})

type OrgFormValues = z.infer<typeof orgSchema>

const branchSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
})

type BranchFormValues = z.infer<typeof branchSchema>

export default function SettingsPage() {
  const { data: org, isLoading: orgLoading } = useOrganization()
  const updateOrg = useUpdateOrganization()
  const { data: branches, isLoading: branchesLoading } = useBranches()
  const createBranch = useCreateBranch()
  const deleteBranch = useDeleteBranch()
  const [showBranchForm, setShowBranchForm] = useState(false)

  const orgForm = useForm<OrgFormValues>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: org?.name || "",
      phone: org?.phone || "",
      email: org?.email || "",
      address: org?.address || "",
    },
    values: {
      name: org?.name || "",
      phone: org?.phone || "",
      email: org?.email || "",
      address: org?.address || "",
    },
  })

  const branchForm = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: { name: "", address: "", phone: "" },
  })

  if (orgLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your organization" />

      <Tabs defaultValue="org" className="space-y-6">
        <TabsList>
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
        </TabsList>

        <TabsContent value="org">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...orgForm}>
              <form
                onSubmit={orgForm.handleSubmit((data) =>
                  updateOrg.mutate(data)
                )}
                className="space-y-4 max-w-lg"
              >
                  <FormField
                    control={orgForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={orgForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orgForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={orgForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={updateOrg.isPending}>
                    {updateOrg.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {branches?.length || 0} branches
            </p>
            <Button size="sm" onClick={() => setShowBranchForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </div>

          {branchesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : !branches || branches.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">No branches yet</p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => setShowBranchForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Branch
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{branch.name}</p>
                      {!branch.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    {branch.address && (
                      <p className="text-sm text-muted-foreground">
                        {branch.address}
                      </p>
                    )}
                    {branch.phone && (
                      <p className="text-sm text-muted-foreground">
                        {branch.phone}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => deleteBranch.mutate(branch.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Dialog open={showBranchForm} onOpenChange={setShowBranchForm}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Branch</DialogTitle>
              </DialogHeader>
              <Form {...branchForm}>
              <form
                onSubmit={branchForm.handleSubmit((data) =>
                  createBranch.mutate(data, {
                    onSuccess: () => {
                      branchForm.reset()
                      setShowBranchForm(false)
                    },
                  })
                )}
                className="space-y-4"
              >
                  <FormField
                    control={branchForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Downtown Location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={branchForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={branchForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBranchForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createBranch.isPending}>
                      Create Branch
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}
