"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { Tabs, TabsContent } from '@radix-ui/react-tabs';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, LineChart, Medal, Pencil, Swords, X } from 'lucide-react';
import Link from 'next/link';

interface Record {
  losses: number;
  wins: number;
  ties: number;
}

interface Ranking {
  matches_played: number;
  qual_average: number;
  sort_orders: number[];
  record: Record;
  rank: number;
  dq: number;
  team_key: string;
}

interface SortOrderInfo {
  precision: number;
  name: string;
}

interface Qual {
  num_teams: number;
  ranking: Ranking;
  sort_order_info: SortOrderInfo[];
  status: string;
}

interface Backup {
  out: string;
  in: string;
}

interface Alliance {
  name: string;
  number: number;
  backup: Backup;
  pick: number;
}

interface Playoff {
  level: string;
  current_level_record: Record;
  record: Record;
  status: string;
  playoff_average: number;
}

interface TeamStatus {
  qual: Qual;
  alliance: Alliance;
  playoff: Playoff;
  alliance_status_str: string;
  playoff_status_str: string;
  overall_status_str: string;
  next_match_key: string;
  last_match_key: string;
}

interface TeamStatuses {
  [key: string]: TeamStatus;
}

export default function TeamPage(){
  const pathname = usePathname();
  const teamName = useSearchParams().get("teamName");
  const teamNumber = pathname.split("?")[0].split("/")[2];
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<void[]>([]);
  const [secondaryData, setSecondaryData] = useState<void[]>([]);
  const [tertiaryData, setTertiaryData] = useState<void[]>([]);
  const baseURL = `https://www.thebluealliance.com/api/v3/` //later on you should figure out which years they competed and how they did.

  async function pullTeamJson(request: string, order: number) {
    setLoading(true); // Start loading
    try {
      const response = await fetch(baseURL+request, {
        headers: {
          'X-TBA-Auth-Key': 'aaGShbjnbckagPKBCb8dzglVebRr4ubkHipyb48KHd2g54KebsyTlVrZLlEKeOwv'
        }
      });
      const responseData = await response.json();
      const processedData = Object.keys(responseData).map(key => {
        const entry = responseData[key];
        return { ...entry }; // Assuming entry is an object
      });
      if (order==0){
        setData(processedData); // Set the processed data
      } else if(order==1) {
        setSecondaryData(processedData);
      } else if (order==2) {
        setTertiaryData(processedData);
        console.log(processedData)
      }
    } catch (error) {
      console.error('Fetching error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  }

  function ordinal_suffix_of(i: number) {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
  }

  useEffect(() => {
    pullTeamJson(`team/frc${teamNumber}/events/2023/statuses`, 0);
    pullTeamJson(`team/frc${teamNumber}/events/2023/simple`, 1);
    pullTeamJson("event/2023arc/oprs", 2);
  }, []); // Include dependencies here
  
  function noData(){
    setTimeout(()=>{
      return <p>No data available</p>
    }, 3000);
    return <p>No data available</p>
  }

  return (
      <>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {teamNumber+" | "+teamName}
            </h2>
            <div className="hidden md:flex items-center space-x-2">
              <Link href={"/"} passHref><Button variant="outline"><X/></Button></Link>
            </div>
          </div>
          {data.length == 0 && !isLoading ? (
            noData()
          ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {secondaryData.map((event, index) => (
              <TabsTrigger key={index} value={`tab${index}`}>
                  {event.key}
              </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Subscriptions
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Now
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview/>
                  </CardContent>
                </Card>
                <Card className="col-span-4 md:col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      You made 265 sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales/>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            {data.map((teamStatus, index) => (
            <TabsContent key={index} value={`tab${index}`} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Final Ranking
                    </CardTitle>
                    <Medal
                      className="h-4 w-4 text-muted-foreground"
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {teamStatus.qual && teamStatus.qual.ranking && teamStatus.qual.ranking.rank 
                        ? ordinal_suffix_of(teamStatus.qual.ranking.rank) + ' of ' + teamStatus.qual.num_teams 
                        : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {teamStatus.qual && teamStatus.qual.ranking && teamStatus.qual.ranking.rank
                        ? `Top ${(100 * parseInt(teamStatus.qual.ranking.rank) / parseInt(teamStatus.qual.num_teams)).toFixed(2)}%`
                        : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      W-L-T Ratio
                    </CardTitle>
                    <LineChart
                      className="h-4 w-4 text-muted-foreground"
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {teamStatus.qual && teamStatus.qual.ranking && teamStatus.qual.ranking.record 
                        ? `${teamStatus.qual.ranking.record.wins}-${teamStatus.qual.ranking.record.losses}-${teamStatus.qual.ranking.record.ties}`
                        : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {teamStatus.qual && teamStatus.qual.ranking && teamStatus.qual.ranking.record 
                        ? `${(100 * teamStatus.qual.ranking.record.wins / (teamStatus.qual.ranking.record.wins + teamStatus.qual.ranking.record.losses + teamStatus.qual.ranking.record.ties)).toFixed(2)}% Win Rate`
                        : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Alliance</CardTitle>
                    <Swords
                      className="h-4 w-4 text-muted-foreground"
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{teamStatus.alliance && teamStatus.alliance.number ? ordinal_suffix_of(teamStatus.alliance.number) : "N/A"}</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      OPR
                    </CardTitle>
                    <Coins
                      className="h-4 w-4 text-muted-foreground"
                    />
                  </CardHeader>
                  <CardContent>
                    {tertiaryData && tertiaryData.length > 0 ? 
                        (
                          <div className="text-2xl font-bold">
                            {tertiaryData[0][`frc${teamNumber}`] !== undefined ? tertiaryData[0][`frc${teamNumber}`].toFixed(2) : "N/A"}
                          </div>
                        )
                        : <div className="text-2xl font-bold">N/A</div>
                      }
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview/>
                  </CardContent>
                </Card>
                <Card className="col-span-4 md:col-span-3">
                  <CardHeader className='flex flex-row'>
                    <div>
                      <CardTitle>Recent Sales</CardTitle>
                      <CardDescription>
                        You made 265 sales this month.
                      </CardDescription>
                    </div>
                    <div>
                      <Button variant="outline"><Pencil/></Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RecentSales/>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            ))}
          </Tabs>
          )}
        </div>
      </>
    );
}