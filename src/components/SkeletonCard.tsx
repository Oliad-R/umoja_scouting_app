import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';

export default function SkeletonCard(){
    return (
        <Card className="flex flex-col justify-between">
            <CardHeader className="flex-row gap-4 items-center">
                <Skeleton className="h-12 flex-grow"/>
            </CardHeader>
            <CardDescription>
                <Skeleton className="h-12 flex-grow"/>
            </CardDescription>
            {/* <CardContent>
                <Skeleton className="h-12 flex-grow"/>
            </CardContent> */}
            <CardFooter>
                <Skeleton className="h-12 flex-grow"/>
            </CardFooter>
        </Card>
    )
}