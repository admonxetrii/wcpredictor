import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Teams with FIFA 3-letter codes
const TEAMS = [
  { code: 'MEX', name: 'Mexico', group: 'A' },
  { code: 'RSA', name: 'South Africa', group: 'A' },
  { code: 'KOR', name: 'South Korea', group: 'A' },
  { code: 'CZE', name: 'Czechia', group: 'A' },

  { code: 'CAN', name: 'Canada', group: 'B' },
  { code: 'BIH', name: 'Bosnia and Herzegovina', group: 'B' },
  { code: 'QAT', name: 'Qatar', group: 'B' },
  { code: 'SUI', name: 'Switzerland', group: 'B' },

  { code: 'BRA', name: 'Brazil', group: 'C' },
  { code: 'MAR', name: 'Morocco', group: 'C' },
  { code: 'HAI', name: 'Haiti', group: 'C' },
  { code: 'SCO', name: 'Scotland', group: 'C' },

  { code: 'USA', name: 'United States', group: 'D' },
  { code: 'PAR', name: 'Paraguay', group: 'D' },
  { code: 'AUS', name: 'Australia', group: 'D' },
  { code: 'TUR', name: 'Türkiye', group: 'D' },

  { code: 'GER', name: 'Germany', group: 'E' },
  { code: 'CUW', name: 'Curaçao', group: 'E' },
  { code: 'CIV', name: 'Ivory Coast', group: 'E' },
  { code: 'ECU', name: 'Ecuador', group: 'E' },

  { code: 'NED', name: 'Netherlands', group: 'F' },
  { code: 'JPN', name: 'Japan', group: 'F' },
  { code: 'SWE', name: 'Sweden', group: 'F' },
  { code: 'TUN', name: 'Tunisia', group: 'F' },

  { code: 'BEL', name: 'Belgium', group: 'G' },
  { code: 'EGY', name: 'Egypt', group: 'G' },
  { code: 'IRN', name: 'Iran', group: 'G' },
  { code: 'NZL', name: 'New Zealand', group: 'G' },

  { code: 'ESP', name: 'Spain', group: 'H' },
  { code: 'CPV', name: 'Cabo Verde', group: 'H' },
  { code: 'KSA', name: 'Saudi Arabia', group: 'H' },
  { code: 'URU', name: 'Uruguay', group: 'H' },

  { code: 'FRA', name: 'France', group: 'I' },
  { code: 'SEN', name: 'Senegal', group: 'I' },
  { code: 'IRQ', name: 'Iraq', group: 'I' },
  { code: 'NOR', name: 'Norway', group: 'I' },

  { code: 'ARG', name: 'Argentina', group: 'J' },
  { code: 'ALG', name: 'Algeria', group: 'J' },
  { code: 'AUT', name: 'Austria', group: 'J' },
  { code: 'JOR', name: 'Jordan', group: 'J' },

  { code: 'POR', name: 'Portugal', group: 'K' },
  { code: 'COD', name: 'DR Congo', group: 'K' },
  { code: 'UZB', name: 'Uzbekistan', group: 'K' },
  { code: 'COL', name: 'Colombia', group: 'K' },

  { code: 'ENG', name: 'England', group: 'L' },
  { code: 'CRO', name: 'Croatia', group: 'L' },
  { code: 'GHA', name: 'Ghana', group: 'L' },
  { code: 'PAN', name: 'Panama', group: 'L' },
];

function getTeamName(code: string) {
  return TEAMS.find((t) => t.code === code)?.name || code;
}

const VENUES = ['Estadio Azteca', 'Estadio Akron', 'Toronto Stadium', 'Los Angeles Stadium', 'San Francisco Bay Area Stadium', 'New York New Jersey Stadium', 'Boston Stadium', 'Vancouver', 'Houston Stadium', 'Dallas Stadium', 'Miami', 'Seattle'];

async function main() {
  console.log('Start seeding...')

  // 72 Official Group Matches Mapped to Teams and Venues
  const groupMatches = [
    // Match day 1
    { matchNumber: 1, teamA: 'MEX', teamB: 'RSA', groupName: 'A', venue: 'Estadio Azteca', city: 'Mexico City', stage: 'GROUP', kickoffTime: new Date('2026-06-12T00:45:00+05:45') },
    { matchNumber: 2, teamA: 'KOR', teamB: 'CZE', groupName: 'A', venue: 'Estadio Akron', city: 'Zapopan', stage: 'GROUP', kickoffTime: new Date('2026-06-12T07:45:00+05:45') },

    // Match day 2
    { matchNumber: 3, teamA: 'CAN', teamB: 'BIH', groupName: 'B', venue: 'BMO Field', city: 'Toronto', stage: 'GROUP', kickoffTime: new Date('2026-06-13T00:45:00+05:45') },
    { matchNumber: 4, teamA: 'USA', teamB: 'PAR', groupName: 'D', venue: 'SoFi Stadium', city: 'Inglewood', stage: 'GROUP', kickoffTime: new Date('2026-06-13T06:45:00+05:45') },

    // Match day 3
    { matchNumber: 5, teamA: 'QAT', teamB: 'SUI', groupName: 'B', venue: 'Levi\'s Stadium', city: 'Santa Clara', stage: 'GROUP', kickoffTime: new Date('2026-06-14T00:45:00+05:45') },
    { matchNumber: 6, teamA: 'BRA', teamB: 'MAR', groupName: 'C', venue: 'Gillette Stadium', city: 'Foxborough', stage: 'GROUP', kickoffTime: new Date('2026-06-14T03:45:00+05:45') },
    { matchNumber: 7, teamA: 'HAI', teamB: 'SCO', groupName: 'C', venue: 'Levi\'s Stadium', city: 'Santa Clara', stage: 'GROUP', kickoffTime: new Date('2026-06-14T06:45:00+05:45') },
    { matchNumber: 8, teamA: 'AUS', teamB: 'TUR', groupName: 'D', venue: 'MetLife Stadium', city: 'East Rutherford', stage: 'GROUP', kickoffTime: new Date('2026-06-14T09:45:00+05:45') },
    { matchNumber: 9, teamA: 'GER', teamB: 'CUW', groupName: 'E', venue: 'AT&T Stadium', city: 'Arlington', stage: 'GROUP', kickoffTime: new Date('2026-06-14T22:45:00+05:45') },

    // Match day 4
    { matchNumber: 10, teamA: 'NED', teamB: 'JPN', groupName: 'F', venue: 'Lincoln Financial Field', city: 'Philadelphia', stage: 'GROUP', kickoffTime: new Date('2026-06-15T01:45:00+05:45') },
    { matchNumber: 11, teamA: 'CIV', teamB: 'ECU', groupName: 'E', venue: 'NRG Stadium', city: 'Houston', stage: 'GROUP', kickoffTime: new Date('2026-06-15T04:45:00+05:45') },
    { matchNumber: 12, teamA: 'SWE', teamB: 'TUN', groupName: 'F', venue: 'Estadio BBVA', city: 'Guadalupe', stage: 'GROUP', kickoffTime: new Date('2026-06-15T07:45:00+05:45') },
    { matchNumber: 13, teamA: 'ESP', teamB: 'CPV', groupName: 'H', venue: 'Lumen Field', city: 'Seattle', stage: 'GROUP', kickoffTime: new Date('2026-06-15T21:45:00+05:45') },

    // Match day 5
    { matchNumber: 14, teamA: 'BEL', teamB: 'EGY', groupName: 'G', venue: 'SoFi Stadium', city: 'Inglewood', stage: 'GROUP', kickoffTime: new Date('2026-06-16T00:45:00+05:45') },
    { matchNumber: 15, teamA: 'KSA', teamB: 'URU', groupName: 'H', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', stage: 'GROUP', kickoffTime: new Date('2026-06-16T03:45:00+05:45') },
    { matchNumber: 16, teamA: 'IRN', teamB: 'NZL', groupName: 'G', venue: 'Hard Rock Stadium', city: 'Miami Gardens', stage: 'GROUP', kickoffTime: new Date('2026-06-16T06:45:00+05:45') },

    // Match day 6
    { matchNumber: 17, teamA: 'FRA', teamB: 'SEN', groupName: 'I', venue: 'MetLife Stadium', city: 'East Rutherford', stage: 'GROUP', kickoffTime: new Date('2026-06-17T00:45:00+05:45') },
    { matchNumber: 18, teamA: 'IRQ', teamB: 'NOR', groupName: 'I', venue: 'Gillette Stadium', city: 'Foxborough', stage: 'GROUP', kickoffTime: new Date('2026-06-17T03:45:00+05:45') },
    { matchNumber: 19, teamA: 'ARG', teamB: 'ALG', groupName: 'J', venue: 'Arrowhead Stadium', city: 'Kansas City', stage: 'GROUP', kickoffTime: new Date('2026-06-17T06:45:00+05:45') },
    { matchNumber: 20, teamA: 'AUT', teamB: 'JOR', groupName: 'J', venue: 'Levi\'s Stadium', city: 'Santa Clara', stage: 'GROUP', kickoffTime: new Date('2026-06-17T09:45:00+05:45') },
    { matchNumber: 21, teamA: 'POR', teamB: 'COD', groupName: 'K', venue: 'Toronto Stadium', city: 'Toronto', stage: 'GROUP', kickoffTime: new Date('2026-06-17T22:45:00+05:45') },

    // Match day 7
    { matchNumber: 22, teamA: 'ENG', teamB: 'CRO', groupName: 'L', venue: 'AT&T Stadium', city: 'Arlington', stage: 'GROUP', kickoffTime: new Date('2026-06-18T01:45:00+05:45') },
    { matchNumber: 23, teamA: 'GHA', teamB: 'PAN', groupName: 'L', venue: 'NRG Stadium', city: 'Houston', stage: 'GROUP', kickoffTime: new Date('2026-06-18T04:45:00+05:45') },
    { matchNumber: 24, teamA: 'UZB', teamB: 'COL', groupName: 'K', venue: 'Estadio Azteca', city: 'Mexico City', stage: 'GROUP', kickoffTime: new Date('2026-06-18T07:45:00+05:45') },
    { matchNumber: 25, teamA: 'CZE', teamB: 'RSA', groupName: 'A', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', stage: 'GROUP', kickoffTime: new Date('2026-06-18T21:45:00+05:45') },

    // Match day 8
    { matchNumber: 26, teamA: 'SUI', teamB: 'BIH', groupName: 'B', venue: 'SoFi Stadium', city: 'Inglewood', stage: 'GROUP', kickoffTime: new Date('2026-06-19T00:45:00+05:45') },
    { matchNumber: 27, teamA: 'CAN', teamB: 'QAT', groupName: 'B', venue: 'BC Place', city: 'Vancouver', stage: 'GROUP', kickoffTime: new Date('2026-06-19T03:45:00+05:45') },
    { matchNumber: 28, teamA: 'MEX', teamB: 'KOR', groupName: 'A', venue: 'Estadio Akron', city: 'Zapopan', stage: 'GROUP', kickoffTime: new Date('2026-06-19T06:45:00+05:45') },

    // Match day 9
    { matchNumber: 29, teamA: 'USA', teamB: 'AUS', groupName: 'D', venue: 'Levi\'s Stadium', city: 'Santa Clara', stage: 'GROUP', kickoffTime: new Date('2026-06-20T00:45:00+05:45') },
    { matchNumber: 30, teamA: 'SCO', teamB: 'MAR', groupName: 'C', venue: 'Gillette Stadium', city: 'Foxborough', stage: 'GROUP', kickoffTime: new Date('2026-06-20T03:45:00+05:45') },
    { matchNumber: 31, teamA: 'BRA', teamB: 'HAI', groupName: 'C', venue: 'Lumen Field', city: 'Seattle', stage: 'GROUP', kickoffTime: new Date('2026-06-20T06:15:00+05:45') },
    { matchNumber: 32, teamA: 'TUR', teamB: 'PAR', groupName: 'D', venue: 'Levi\'s Stadium', city: 'Santa Clara', stage: 'GROUP', kickoffTime: new Date('2026-06-20T08:45:00+05:45') },
    { matchNumber: 33, teamA: 'NED', teamB: 'SWE', groupName: 'F', venue: 'Arrowhead Stadium', city: 'Kansas City', stage: 'GROUP', kickoffTime: new Date('2026-06-20T22:45:00+05:45') },

    // Match day 10`
    { matchNumber: 34, teamA: 'GER', teamB: 'CIV', groupName: 'E', venue: 'NRG Stadium', city: 'Houston', stage: 'GROUP', kickoffTime: new Date('2026-06-21T01:45:00+05:45') },
    { matchNumber: 35, teamA: 'ECU', teamB: 'CUW', groupName: 'E', venue: 'BMO Field', city: 'Toronto', stage: 'GROUP', kickoffTime: new Date('2026-06-21T05:45:00+05:45') },
    { matchNumber: 36, teamA: 'TUN', teamB: 'JPN', groupName: 'F', venue: 'Estadio BBVA', city: 'Guadalupe', stage: 'GROUP', kickoffTime: new Date('2026-06-21T09:45:00+05:45') },
    { matchNumber: 37, teamA: 'ESP', teamB: 'KSA', groupName: 'H', venue: 'SoFi Stadium', city: 'Inglewood', stage: 'GROUP', kickoffTime: new Date('2026-06-21T21:45:00+05:45') },

    // Match day 11
    { matchNumber: 38, teamA: 'BEL', teamB: 'IRN', groupName: 'G', venue: 'Hard Rock Stadium', city: 'Miami Gardens', stage: 'GROUP', kickoffTime: new Date('2026-06-22T00:45:00+05:45') },
    { matchNumber: 39, teamA: 'URU', teamB: 'CPV', groupName: 'H', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', stage: 'GROUP', kickoffTime: new Date('2026-06-22T03:45:00+05:45') },
    { matchNumber: 40, teamA: 'NZL', teamB: 'EGY', groupName: 'G', venue: 'BC Place', city: 'Vancouver', stage: 'GROUP', kickoffTime: new Date('2026-06-22T06:45:00+05:45') },
    { matchNumber: 41, teamA: 'ARG', teamB: 'AUT', groupName: 'J', venue: 'MetLife Stadium', city: 'East Rutherford', stage: 'GROUP', kickoffTime: new Date('2026-06-22T22:45:00+05:45') },

    // Match day 12
    { matchNumber: 42, teamA: 'FRA', teamB: 'IRQ', groupName: 'I', venue: 'Lincoln Financial Field', city: 'Philadelphia', stage: 'GROUP', kickoffTime: new Date('2026-06-23T02:45:00+05:45') },
    { matchNumber: 43, teamA: 'NOR', teamB: 'SEN', groupName: 'I', venue: 'AT&T Stadium', city: 'Arlington', stage: 'GROUP', kickoffTime: new Date('2026-06-23T05:45:00+05:45') },
    { matchNumber: 44, teamA: 'JOR', teamB: 'ALG', groupName: 'J', venue: 'Levi\'s Stadium', city: 'Santa Clara', stage: 'GROUP', kickoffTime: new Date('2026-06-23T08:45:00+05:45') },
    { matchNumber: 45, teamA: 'POR', teamB: 'UZB', groupName: 'K', venue: 'Toronto Stadium', city: 'Toronto', stage: 'GROUP', kickoffTime: new Date('2026-06-23T22:45:00+05:45') },

    // Match day 13
    { matchNumber: 46, teamA: 'ENG', teamB: 'GHA', groupName: 'L', venue: 'NRG Stadium', city: 'Houston', stage: 'GROUP', kickoffTime: new Date('2026-06-24T01:45:00+05:45') },
    { matchNumber: 47, teamA: 'PAN', teamB: 'CRO', groupName: 'L', venue: 'Gillette Stadium', city: 'Foxborough', stage: 'GROUP', kickoffTime: new Date('2026-06-24T04:45:00+05:45') },
    { matchNumber: 48, teamA: 'COL', teamB: 'COD', groupName: 'K', venue: 'Estadio Akron', city: 'Zapopan', stage: 'GROUP', kickoffTime: new Date('2026-06-24T07:45:00+05:45') },

    // Match day 14
    { matchNumber: 49, teamA: 'SUI', teamB: 'CAN', groupName: 'B', venue: 'Hard Rock Stadium', city: 'Miami Gardens', stage: 'GROUP', kickoffTime: new Date('2026-06-25T00:45:00+05:45') },
    { matchNumber: 50, teamA: 'BIH', teamB: 'QAT', groupName: 'B', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', stage: 'GROUP', kickoffTime: new Date('2026-06-25T00:45:00+05:45') },
    { matchNumber: 51, teamA: 'MAR', teamB: 'HAI', groupName: 'C', venue: 'Lumen Field', city: 'Seattle', stage: 'GROUP', kickoffTime: new Date('2026-06-25T03:45:00+05:45') },
    { matchNumber: 52, teamA: 'SCO', teamB: 'BRA', groupName: 'C', venue: 'BC Place', city: 'Vancouver', stage: 'GROUP', kickoffTime: new Date('2026-06-25T03:45:00+05:45') },
    { matchNumber: 53, teamA: 'RSA', teamB: 'KOR', groupName: 'A', venue: 'Estadio Azteca', city: 'Mexico City', stage: 'GROUP', kickoffTime: new Date('2026-06-25T06:45:00+05:45') },
    { matchNumber: 54, teamA: 'CZE', teamB: 'MEX', groupName: 'A', venue: 'Estadio BBVA', city: 'Guadalupe', stage: 'GROUP', kickoffTime: new Date('2026-06-25T06:45:00+05:45') },

    // Match day 15
    { matchNumber: 55, teamA: 'CUW', teamB: 'CIV', groupName: 'E', venue: 'MetLife Stadium', city: 'East Rutherford', stage: 'GROUP', kickoffTime: new Date('2026-06-26T01:45:00+05:45') },
    { matchNumber: 56, teamA: 'ECU', teamB: 'GER', groupName: 'E', venue: 'Lincoln Financial Field', city: 'Philadelphia', stage: 'GROUP', kickoffTime: new Date('2026-06-26T01:45:00+05:45') },
    { matchNumber: 57, teamA: 'TUN', teamB: 'NED', groupName: 'F', venue: 'AT&T Stadium', city: 'Arlington', stage: 'GROUP', kickoffTime: new Date('2026-06-26T04:45:00+05:45') },
    { matchNumber: 58, teamA: 'JPN', teamB: 'SWE', groupName: 'F', venue: 'Arrowhead Stadium', city: 'Kansas City', stage: 'GROUP', kickoffTime: new Date('2026-06-26T04:45:00+05:45') },
    { matchNumber: 59, teamA: 'TUR', teamB: 'USA', groupName: 'D', venue: 'SoFi Stadium', city: 'Inglewood', stage: 'GROUP', kickoffTime: new Date('2026-06-26T07:45:00+05:45') },
    { matchNumber: 60, teamA: 'PAR', teamB: 'AUS', groupName: 'D', venue: 'Levi\'s Stadium', city: 'Santa Clara', stage: 'GROUP', kickoffTime: new Date('2026-06-26T07:45:00+05:45') },

    // Match day 16
    { matchNumber: 61, teamA: 'NOR', teamB: 'FRA', groupName: 'I', venue: 'Gillette Stadium', city: 'Foxborough', stage: 'GROUP', kickoffTime: new Date('2026-06-27T00:45:00+05:45') },
    { matchNumber: 62, teamA: 'SEN', teamB: 'IRQ', groupName: 'I', venue: 'BMO Field', city: 'Toronto', stage: 'GROUP', kickoffTime: new Date('2026-06-27T00:45:00+05:45') },
    { matchNumber: 63, teamA: 'CPV', teamB: 'KSA', groupName: 'H', venue: 'Estadio Akron', city: 'Zapopan', stage: 'GROUP', kickoffTime: new Date('2026-06-27T05:45:00+05:45') },
    { matchNumber: 64, teamA: 'URU', teamB: 'ESP', groupName: 'H', venue: 'NRG Stadium', city: 'Houston', stage: 'GROUP', kickoffTime: new Date('2026-06-27T05:45:00+05:45') },
    { matchNumber: 65, teamA: 'NZL', teamB: 'BEL', groupName: 'G', venue: 'Lumen Field', city: 'Seattle', stage: 'GROUP', kickoffTime: new Date('2026-06-27T08:45:00+05:45') },
    { matchNumber: 66, teamA: 'EGY', teamB: 'IRN', groupName: 'G', venue: 'BC Place', city: 'Vancouver', stage: 'GROUP', kickoffTime: new Date('2026-06-27T08:45:00+05:45') },

    // Match day 17
    { matchNumber: 67, teamA: 'PAN', teamB: 'ENG', groupName: 'L', venue: 'MetLife Stadium', city: 'East Rutherford', stage: 'GROUP', kickoffTime: new Date('2026-06-28T02:45:00+05:45') },
    { matchNumber: 68, teamA: 'CRO', teamB: 'GHA', groupName: 'L', venue: 'Lincoln Financial Field', city: 'Philadelphia', stage: 'GROUP', kickoffTime: new Date('2026-06-28T02:45:00+05:45') },
    { matchNumber: 69, teamA: 'COL', teamB: 'POR', groupName: 'K', venue: 'Arrowhead Stadium', city: 'Kansas City', stage: 'GROUP', kickoffTime: new Date('2026-06-28T05:15:00+05:45') },
    { matchNumber: 70, teamA: 'COD', teamB: 'UZB', groupName: 'K', venue: 'AT&T Stadium', city: 'Arlington', stage: 'GROUP', kickoffTime: new Date('2026-06-28T05:15:00+05:45') },
    { matchNumber: 71, teamA: 'ALG', teamB: 'AUT', groupName: 'J', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', stage: 'GROUP', kickoffTime: new Date('2026-06-28T07:45:00+05:45') },
    { matchNumber: 72, teamA: 'JOR', teamB: 'ARG', groupName: 'J', venue: 'Hard Rock Stadium', city: 'Miami Gardens', stage: 'GROUP', kickoffTime: new Date('2026-06-28T07:45:00+05:45') }
  ];
  // 32 Official Knockout Matches
  const knockoutMatches = [
    { matchNumber: 73, teamA: 'TBD', teamB: 'TBD', teamAName: 'Runner-up Group A', teamBName: 'Runner-up Group B', venue: 'SoFi Stadium', city: 'Inglewood', stage: 'ROUND_OF_32', slotDesc: 'Runner-up Group A vs Runner-up Group B', kickoffTime: new Date('2026-06-29T00:45:00+05:45') },
    { matchNumber: 74, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Group C', teamBName: 'Runner-up Group F', venue: 'NRG Stadium', city: 'Houston', stage: 'ROUND_OF_32', slotDesc: 'Winner Group C vs Runner-up Group F', kickoffTime: new Date('2026-06-29T22:45:00+05:45') },
    { matchNumber: 75, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Group E', teamBName: '3rd Group A/B/C/D/F', venue: 'Gillette Stadium', city: 'Foxborough', stage: 'ROUND_OF_32', slotDesc: 'Winner Group E vs 3rd Group A/B/C/D/F', kickoffTime: new Date('2026-06-30T02:15:00+05:45') },
    { matchNumber: 76, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Group F', teamBName: 'Runner-up Group C', venue: 'Estadio BBVA', city: 'Guadalupe', stage: 'ROUND_OF_32', slotDesc: 'Winner Group F vs Runner-up Group C', kickoffTime: new Date('2026-06-30T06:45:00+05:45') },
    { matchNumber: 77, teamA: 'TBD', teamB: 'TBD', teamAName: 'Runner-up Group E', teamBName: 'Runner-up Group I', venue: 'AT&T Stadium', city: 'Arlington', stage: 'ROUND_OF_32', slotDesc: 'Runner-up Group E vs Runner-up Group I', kickoffTime: new Date('2026-06-30T22:45:00+05:45') },
    { matchNumber: 78, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Group I', teamBName: '3rd Group C/D/F/G/H', venue: 'MetLife Stadium', city: 'East Rutherford', stage: 'ROUND_OF_32', slotDesc: 'Winner Group I vs 3rd Group C/D/F/G/H', kickoffTime: new Date('2026-07-01T02:45:00+05:45') },
    { matchNumber: 79, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Group A', teamBName: '3rd Group C/E/F/H/I', venue: 'Estadio Azteca', city: 'Mexico City', stage: 'ROUND_OF_32', slotDesc: 'Winner Group A vs 3rd Group C/E/F/H/I', kickoffTime: new Date('2026-07-01T06:45:00+05:45') },
    { matchNumber: 80, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Group L', teamBName: '3rd Group E/H/I/J/K', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', stage: 'ROUND_OF_32', slotDesc: 'Winner Group L vs 3rd Group E/H/I/J/K', kickoffTime: new Date('2026-07-01T21:45:00+05:45') },
    { matchNumber: 81, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Group G', teamBName: '3rd Group A/E/H/I/J', venue: 'Lumen Field', city: 'Seattle', stage: 'ROUND_OF_32', slotDesc: 'Winner Group G vs 3rd Group A/E/H/I/J', kickoffTime: new Date('2026-07-02T01:45:00+05:45') },
    { matchNumber: 82, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Group D', teamBName: '3rd Group B/E/F/I/J', venue: 'Levi\'s Stadium', city: 'Santa Clara', stage: 'ROUND_OF_32', slotDesc: 'Winner Group D vs 3rd Group B/E/F/I/J', kickoffTime: new Date('2026-07-02T05:45:00+05:45') },
    { matchNumber: 83, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Group H', teamBName: 'Runner-up Group J', venue: 'SoFi Stadium', city: 'Inglewood', stage: 'ROUND_OF_32', slotDesc: 'Winner Group H vs Runner-up Group J', kickoffTime: new Date('2026-07-03T00:45:00+05:45') },
    { matchNumber: 84, teamA: 'TBD', teamB: 'TBD', teamAName: 'Runner-up Group K', teamBName: 'Runner-up Group L', venue: 'BMO Field', city: 'Toronto', stage: 'ROUND_OF_32', slotDesc: 'Runner-up Group K vs Runner-up Group L', kickoffTime: new Date('2026-07-03T04:45:00+05:45') },
    { matchNumber: 85, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Group B', teamBName: '3rd Group E/F/G/I/J', venue: 'BC Place', city: 'Vancouver', stage: 'ROUND_OF_32', slotDesc: 'Winner Group B vs 3rd Group E/F/G/I/J', kickoffTime: new Date('2026-07-03T08:45:00+05:45') },
    { matchNumber: 86, teamA: 'TBD', teamB: 'TBD', teamAName: 'Runner-up Group D', teamBName: 'Runner-up Group G', venue: 'AT&T Stadium', city: 'Arlington', stage: 'ROUND_OF_32', slotDesc: 'Runner-up Group D vs Runner-up Group G', kickoffTime: new Date('2026-07-03T23:45:00+05:45') },
    { matchNumber: 87, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Group J', teamBName: 'Runner-up Group H', venue: 'Hard Rock Stadium', city: 'Miami Gardens', stage: 'ROUND_OF_32', slotDesc: 'Winner Group J vs Runner-up Group H', kickoffTime: new Date('2026-07-04T03:45:00+05:45') },
    { matchNumber: 88, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Group K', teamBName: '3rd Group D/E/I/J/L', venue: 'Arrowhead Stadium', city: 'Kansas City', stage: 'ROUND_OF_32', slotDesc: 'Winner Group K vs 3rd Group D/E/I/J/L', kickoffTime: new Date('2026-07-04T07:15:00+05:45') },

    { matchNumber: 89, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 73', teamBName: 'Winner Match 75', venue: 'NRG Stadium', city: 'Houston', stage: 'ROUND_OF_16', slotDesc: 'Winner Match 73 vs Winner Match 75', kickoffTime: new Date('2026-07-04T22:45:00+05:45') },
    { matchNumber: 90, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 74', teamBName: 'Winner Match 77', venue: 'Lincoln Financial Field', city: 'Philadelphia', stage: 'ROUND_OF_16', slotDesc: 'Winner Match 74 vs Winner Match 77', kickoffTime: new Date('2026-07-05T02:45:00+05:45') },
    { matchNumber: 91, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 76', teamBName: 'Winner Match 78', venue: 'MetLife Stadium', city: 'East Rutherford', stage: 'ROUND_OF_16', slotDesc: 'Winner Match 76 vs Winner Match 78', kickoffTime: new Date('2026-07-06T01:45:00+05:45') },
    { matchNumber: 92, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 79', teamBName: 'Winner Match 80', venue: 'Estadio Azteca', city: 'Mexico City', stage: 'ROUND_OF_16', slotDesc: 'Winner Match 79 vs Winner Match 80', kickoffTime: new Date('2026-07-06T05:45:00+05:45') },
    { matchNumber: 93, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 83', teamBName: 'Winner Match 84', venue: 'AT&T Stadium', city: 'Arlington', stage: 'ROUND_OF_16', slotDesc: 'Winner Match 83 vs Winner Match 84', kickoffTime: new Date('2026-07-07T00:45:00+05:45') },
    { matchNumber: 94, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 81', teamBName: 'Winner Match 82', venue: 'Lumen Field', city: 'Seattle', stage: 'ROUND_OF_16', slotDesc: 'Winner Match 81 vs Winner Match 82', kickoffTime: new Date('2026-07-07T05:45:00+05:45') },
    { matchNumber: 95, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 86', teamBName: 'Winner Match 88', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', stage: 'ROUND_OF_16', slotDesc: 'Winner Match 86 vs Winner Match 88', kickoffTime: new Date('2026-07-07T21:45:00+05:45') },
    { matchNumber: 96, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 85', teamBName: 'Winner Match 87', venue: 'BC Place', city: 'Vancouver', stage: 'ROUND_OF_16', slotDesc: 'Winner Match 85 vs Winner Match 87', kickoffTime: new Date('2026-07-08T01:45:00+05:45') },

    { matchNumber: 97, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 89', teamBName: 'Winner Match 90', venue: 'Gillette Stadium', city: 'Foxborough', stage: 'QUARTER_FINAL', slotDesc: 'Winner Match 89 vs Winner Match 90', kickoffTime: new Date('2026-07-10T01:45:00+05:45') },
    { matchNumber: 98, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 93', teamBName: 'Winner Match 94', venue: 'SoFi Stadium', city: 'Inglewood', stage: 'QUARTER_FINAL', slotDesc: 'Winner Match 93 vs Winner Match 94', kickoffTime: new Date('2026-07-11T00:45:00+05:45') },
    { matchNumber: 99, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 91', teamBName: 'Winner Match 92', venue: 'Hard Rock Stadium', city: 'Miami Gardens', stage: 'QUARTER_FINAL', slotDesc: 'Winner Match 91 vs Winner Match 92', kickoffTime: new Date('2026-07-12T02:45:00+05:45') },
    { matchNumber: 100, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 95', teamBName: 'Winner Match 96', venue: 'Arrowhead Stadium', city: 'Kansas City', stage: 'QUARTER_FINAL', slotDesc: 'Winner Match 95 vs Winner Match 96', kickoffTime: new Date('2026-07-12T06:45:00+05:45') },

    { matchNumber: 101, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 97', teamBName: 'Winner Match 98', venue: 'AT&T Stadium', city: 'Arlington', stage: 'SEMI_FINAL', slotDesc: 'Winner Match 97 vs Winner Match 98', kickoffTime: new Date('2026-07-15T00:45:00+05:45') },
    { matchNumber: 102, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 99', teamBName: 'Winner Match 100', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', stage: 'SEMI_FINAL', slotDesc: 'Winner Match 99 vs Winner Match 100', kickoffTime: new Date('2026-07-16T00:45:00+05:45') },

    { matchNumber: 103, teamA: 'TBD', teamB: 'TBD', teamAName: 'Loser Match 101', teamBName: 'Loser Match 102', venue: 'Hard Rock Stadium', city: 'Miami Gardens', stage: 'THIRD_PLACE', slotDesc: 'Loser Match 101 vs Loser Match 102', kickoffTime: new Date('2026-07-19T02:45:00+05:45') },

    { matchNumber: 104, teamA: 'TBD', teamB: 'TBD', teamAName: 'Winner Match 101', teamBName: 'Winner Match 102', venue: 'MetLife Stadium', city: 'East Rutherford', stage: 'FINAL', slotDesc: 'Winner Match 101 vs Winner Match 102', kickoffTime: new Date('2026-07-20T00:45:00+05:45') }
  ];

  // Insert Group Matches
  for (const match of groupMatches) {
    await prisma.match.upsert({
      where: { matchNumber: match.matchNumber },
      update: {
        teamA: match.teamA,
        teamB: match.teamB,
        teamAName: getTeamName(match.teamA),
        teamBName: getTeamName(match.teamB),
        groupName: match.groupName,
        venue: match.venue,
        city: match.city,
        kickoffTime: match.kickoffTime,
        stage: match.stage,
      },
      create: {
        matchNumber: match.matchNumber,
        teamA: match.teamA,
        teamB: match.teamB,
        teamAName: getTeamName(match.teamA),
        teamBName: getTeamName(match.teamB),
        groupName: match.groupName,
        venue: match.venue,
        city: match.city,
        kickoffTime: match.kickoffTime,
        stage: match.stage,
      },
    })
  }

  // Insert Knockout Matches
  for (const match of knockoutMatches) {
    await prisma.match.upsert({
      where: { matchNumber: match.matchNumber },
      update: {
        teamA: match.teamA,
        teamB: match.teamB,
        teamAName: match.teamAName,
        teamBName: match.teamBName,
        venue: match.venue,
        city: match.city,
        kickoffTime: match.kickoffTime,
        stage: match.stage,
        slotDescription: match.slotDesc,
      },
      create: {
        matchNumber: match.matchNumber,
        teamA: match.teamA,
        teamB: match.teamB,
        teamAName: match.teamAName,
        teamBName: match.teamBName,
        venue: match.venue,
        city: match.city,
        kickoffTime: match.kickoffTime,
        stage: match.stage,
        slotDescription: match.slotDesc,
      },
    })
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create an admin user for testing
  await prisma.user.upsert({
    where: { email: 'admin@nishamwagle.com.np' },
    update: { role: 'ADMIN', isActive: true, amountPaid: 1000, passwordHash: hashedPassword },
    create: {
      name: 'Super Admin',
      email: 'admin@nishamwagle.com.np',
      username: 'admin',
      role: 'ADMIN',
      isActive: true,
      amountPaid: 1000,
      passwordHash: hashedPassword,
    }
  });

  console.log('Seeding finished. Added 104 matches and Super Admin.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
