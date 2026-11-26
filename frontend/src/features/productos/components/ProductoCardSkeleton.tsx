import Skeleton from '@/shared/components/Skeleton'
import Card from '@/shared/ui/Card'

export default function ProductoCardSkeleton() {
  return (
    <Card className="overflow-hidden" data-testid="producto-skeleton">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </Card>
  )
}
