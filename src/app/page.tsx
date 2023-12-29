"use client";

import { useState, useEffect, SetStateAction } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {  Select,  SelectContent,  SelectGroup,  SelectItem,  SelectLabel,  SelectTrigger,  SelectValue } from "@/components/ui/select"
import { RotateCw, Pencil, Eye, Pin, PinOff, RefreshCcw, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loading from './loading'; // Adjust the import path as needed
import { Value } from '@radix-ui/react-select';

interface Team {
  team_number: number;
  nickname: string;
  school_name: string;
  website: string;
}

export default function Home() {
  const [data, setData] = useState<Team[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [filterVal, setFilter] = useState('');
  const [pinnedTeams, setPinnedTeams] = useState({});
  const apiUrl = 'https://www.thebluealliance.com/api/v3/district/2023ont/teams';

  async function pullJson() {
    setLoading(true); // Start loading
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'X-TBA-Auth-Key': 'aaGShbjnbckagPKBCb8dzglVebRr4ubkHipyb48KHd2g54KebsyTlVrZLlEKeOwv'
        }
      });
      const responseData = await response.json();
      setData(responseData); // Set the fetched data
    } catch (error) {
      console.error('Fetching error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  }

  useEffect(() => {
    pullJson();
  }, []);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  }

  const filteredData = data.filter(team =>
    pinnedTeams[team.team_number] || team.nickname.trim().toLowerCase().includes(searchInput.trim().toLowerCase()) || team.team_number.toString().includes(searchInput.trim().toLowerCase())
  );

  const sortedData = filteredData.sort((a,b) => {
    if (pinnedTeams[a.team_number] && !pinnedTeams[b.team_number]){
      return -1;
    }
    if (!pinnedTeams[a.team_number] && pinnedTeams[b.team_number]){
      return 1;
    }
    return 0;
  });

  const handleFilterChange = (e) => {
    setFilter(e);
    console.log("Filter:"+filterVal);
  }

  function refreshSearch() {
    setSearchInput('');
    setFilter('');
    setPinnedTeams({});
    pullJson();
  }

  const togglePinnedTeam = (teamNumber) => {
    setPinnedTeams(prev => ({
      ...prev,
      [teamNumber]: !prev[teamNumber]
    }));
  };

  function pinIcon(teamNumber: number) {return pinnedTeams[teamNumber] ? <PinOff/> : <Pin/>}

  function refreshIcon() {return isLoading ? <Loader2 className="animate-spin"/>: <RotateCw/>}

  return (
    <main>
      <div className="flex w-full items-center space-x-2"> 
      {/* Should probably be a multiselect */}
            <Input type="text" placeholder='Search' value={searchInput} onChange={handleSearchChange}/>
            <Select value={filterVal} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Filter"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Drive Train</SelectLabel>
                  <SelectItem value="td">Tank Drive</SelectItem>
                  <SelectItem value="sd">Swerve Drive</SelectItem>
                  <SelectItem value="md">Mecanum Drive</SelectItem>
                  <SelectItem value="wcd">West-Coast Drive</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Intake</SelectLabel>
                  <SelectItem value="li">Low</SelectItem>
                  <SelectItem value="mi">Mid</SelectItem>
                  <SelectItem value="hi">High</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Autonomous</SelectLabel>
                  <SelectItem value="na">No Auto</SelectItem>
                  <SelectItem value="wa">Working Auto</SelectItem>
                  <SelectItem value="aa">Advanced Auto</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={refreshSearch} variant="secondary" type="button">{refreshIcon()}</Button>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className='grid md:grid-cols-3 grid-cols-1 gap-8'>
            {sortedData.map(team => (
              <Card key={team.team_number}>
                <CardHeader>
                  <div>
                    <CardTitle><a target='_blank' rel="noopener noreferrer" href={team.website}>{team.nickname}</a></CardTitle>
                    <CardDescription>{team.team_number} | {team.school_name}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="space-x-3">
                  <Button><Eye/></Button>
                  <Button><Pencil/></Button>
                  <Button onClick={() => togglePinnedTeam(team.team_number)}>{pinIcon(team.team_number)}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </main>
  );
}