import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn('animate-pulse rounded-lg bg-white/[0.05]', className)}
            {...props}
        />
    );
}

export function HomePageSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <Skeleton className="h-8 w-64" />
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <div className="space-y-2 pt-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[92%]" />
                    <Skeleton className="h-4 w-[85%]" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[88%]" />
                    <Skeleton className="h-4 w-[76%]" />
                </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
                <div className="flex flex-wrap gap-3">
                    {Array.from({ length: 28 }).map((_, i) => (
                        <Skeleton key={i} className="w-12 h-12 rounded-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function AboutPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-3">
                <Skeleton className="h-6 w-24" />
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="rounded-xl border border-white/[0.06] p-4 space-y-2">
                        <div className="flex gap-3">
                            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                                <Skeleton className="h-3 w-2/5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ProjectsPageSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-xl border border-white/[0.06] overflow-hidden">
                    <Skeleton className="h-44 w-full rounded-none" />
                    <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                        <div className="flex gap-1.5 pt-1">
                            {[1, 2, 3].map(j => <Skeleton key={j} className="w-7 h-7 rounded-full" />)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function AchievementsPageSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-xl border border-white/[0.06] overflow-hidden">
                    <Skeleton className="h-40 w-full rounded-none" />
                    <div className="p-4 space-y-2">
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <div className="flex gap-1.5 pt-1">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function DashboardPageSkeleton() {
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="rounded-xl border border-white/[0.06] p-4 space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-7 w-14" />
                    </div>
                ))}
            </div>
            <Skeleton className="h-52 w-full rounded-xl" />
        </div>
    );
}

export function ContactPageSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-[120px] w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
            </div>
        </div>
    );
}