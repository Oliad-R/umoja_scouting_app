"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {  Select,  SelectContent,  SelectGroup,  SelectItem,  SelectLabel,  SelectTrigger,  SelectValue } from "@/components/ui/select"
import { RotateCw, Pencil, Eye, Pin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loading from './loading'; // Adjust the import path as needed

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
    // console.log(pullJson())
  }, []);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  }

  const filteredData = data.filter(team =>
    team.nickname.trim().toLowerCase().includes(searchInput.trim().toLowerCase()) || team.team_number.toString().includes(searchInput.trim().toLowerCase())
  );

  function refreshSearch() {
    setSearchInput('');
    pullJson();
  }

  return (
    <main>
      <div className="flex w-full items-center space-x-2"> 
      {/* Should probably be a multiselect */}
            <Input type="text" placeholder='Search' value={searchInput} onChange={handleSearchChange}/>
            <Select>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Drive Train</SelectLabel>
                  <SelectItem value="est">Tank Drive</SelectItem>
                  <SelectItem value="cst">Swerve Drive</SelectItem>
                  <SelectItem value="mst">Mecanum Drive</SelectItem>
                  <SelectItem value="pst">West-Coast Drive</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Intake</SelectLabel>
                  <SelectItem value="gmt">Low</SelectItem>
                  <SelectItem value="cet">Mid</SelectItem>
                  <SelectItem value="eet">High</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Autonomous</SelectLabel>
                  <SelectItem value="msk">No Auto</SelectItem>
                  <SelectItem value="ist">Working Auto</SelectItem>
                  <SelectItem value="cst_china">Advanced Auto</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={refreshSearch} type="button"><RotateCw/></Button>
      </div>
      {isLoading ? (
        <Loading /> // Render the loading component while data is being fetched
      ) : (
        <>
          <div className='grid md:grid-cols-3 grid-cols-1 gap-8'>
            {filteredData.map(team => (
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
                  <Button><Pin/></Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </main>
  );
}