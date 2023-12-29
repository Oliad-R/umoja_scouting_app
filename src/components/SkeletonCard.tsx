import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';

export default function SkeletonCard(){
    return (
        <Card className="flex flex-col justify-between">
            <CardHeader className="flex-row gap-4 items-center pb-0">
                <Skeleton className="h-7 flex-grow"/>
            </CardHeader>
            <CardDescription>
                <Skeleton className="h-4 w-1/2 mx-6 mb-5 flex-grow"/>
            </CardDescription>
            <CardFooter className="space-x-3 mb-5">
                <Skeleton className="h-10 w-10"/>
                <Skeleton className="h-10 w-10"/>
                <Skeleton className="h-10 w-10"/>
            </CardFooter>
        </Card>
    )
}