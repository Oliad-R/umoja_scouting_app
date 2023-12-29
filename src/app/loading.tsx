import SkeletonCard from "@/components/SkeletonCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function loading(){
    return (
        <main>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {"abcdefghi".split('').map(i=>(
                    <SkeletonCard key={i}/>
                ))}
            </div>
        </main>
    )
}