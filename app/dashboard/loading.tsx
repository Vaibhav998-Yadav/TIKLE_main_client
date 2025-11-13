import TailwindSkeleton from "@/components/ui/tailwind_skeleton";

// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="p-6 text-sm text-muted-foreground animate-pulse">
      <TailwindSkeleton/>
    </div>
  )
}
