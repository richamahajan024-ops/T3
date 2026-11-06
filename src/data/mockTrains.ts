/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrainItem } from '../types/railway';

export const MOCK_TRAINS: TrainItem[] = [
  // ==========================================
  // ROUTE 1: NEW DELHI (NDLS/NZM) -> MUMBAI (MMCT/BDTS/CSMT)
  // ==========================================
  {
    train: {
      number: '12952',
      name: 'Mumbai Rajdhani Express',
      type: 'Rajdhani',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['1A', '2A', '3A'],
      pantry: true,
    },
    from: {
      code: 'NDLS',
      name: 'New Delhi',
      departure: '16:55',
      day: 1,
      platform: '3',
    },
    to: {
      code: 'MMCT',
      name: 'Mumbai Central',
      arrival: '08:35',
      day: 2,
      platform: '1',
    },
    distance: 1384,
    duration: 940, // 15h 40m
    totalHaltsBetween: 6,
    halts: [
      { stationCode: 'KOTA', stationName: 'Kota Junction', arrival: '21:30', departure: '21:40', haltMinutes: 10, distanceKm: 465, day: 1 },
      { stationCode: 'RTM', stationName: 'Ratlam Junction', arrival: '00:42', departure: '00:45', haltMinutes: 3, distanceKm: 731, day: 2 },
      { stationCode: 'BRC', stationName: 'Vadodara Junction', arrival: '03:50', departure: '04:00', haltMinutes: 10, distanceKm: 992, day: 2 },
      { stationCode: 'ST', stationName: 'Surat', arrival: '05:33', departure: '05:38', haltMinutes: 5, distanceKm: 1122, day: 2 },
      { stationCode: 'BVI', stationName: 'Borivali', arrival: '07:58', departure: '08:00', haltMinutes: 2, distanceKm: 1354, day: 2 },
      { stationCode: 'MMCT', stationName: 'Mumbai Central', arrival: '08:35', departure: '08:35', haltMinutes: 0, distanceKm: 1384, day: 2 },
    ],
    remarks: 'Premium high-speed Rajdhani connecting national capital to financial capital.',
  },
  {
    train: {
      number: '12951',
      name: 'New Delhi Rajdhani Express',
      type: 'Rajdhani',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['1A', '2A', '3A'],
      pantry: true,
    },
    from: {
      code: 'MMCT',
      name: 'Mumbai Central',
      departure: '17:00',
      day: 1,
      platform: '2',
    },
    to: {
      code: 'NDLS',
      name: 'New Delhi',
      arrival: '08:32',
      day: 2,
      platform: '4',
    },
    distance: 1384,
    duration: 932, // 15h 32m
    totalHaltsBetween: 6,
  },
  {
    train: {
      number: '12954',
      name: 'August Kranti Tejas Rajdhani Express',
      type: 'Rajdhani',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['1A', '2A', '3A'],
      pantry: true,
    },
    from: {
      code: 'NZM',
      name: 'Hazrat Nizamuddin',
      departure: '17:15',
      day: 1,
      platform: '2',
    },
    to: {
      code: 'MMCT',
      name: 'Mumbai Central',
      arrival: '10:05',
      day: 2,
      platform: '1',
    },
    distance: 1377,
    duration: 1010, // 16h 50m
    totalHaltsBetween: 10,
    halts: [
      { stationCode: 'MTJ', stationName: 'Mathura Junction', arrival: '18:53', departure: '18:55', haltMinutes: 2, distanceKm: 134, day: 1 },
      { stationCode: 'KOTA', stationName: 'Kota Junction', arrival: '22:30', departure: '22:40', haltMinutes: 10, distanceKm: 458, day: 1 },
      { stationCode: 'RTM', stationName: 'Ratlam Junction', arrival: '01:50', departure: '01:53', haltMinutes: 3, distanceKm: 725, day: 2 },
      { stationCode: 'BRC', stationName: 'Vadodara Junction', arrival: '05:18', departure: '05:28', haltMinutes: 10, distanceKm: 986, day: 2 },
      { stationCode: 'ST', stationName: 'Surat', arrival: '07:07', departure: '07:12', haltMinutes: 5, distanceKm: 1115, day: 2 },
      { stationCode: 'BVI', stationName: 'Borivali', arrival: '09:30', departure: '09:32', haltMinutes: 2, distanceKm: 1348, day: 2 },
    ],
  },
  {
    train: {
      number: '22222',
      name: 'CSMT Rajdhani Express',
      type: 'Rajdhani',
      runDays: ['MON', 'WED', 'FRI', 'SAT'],
      classes: ['1A', '2A', '3A'],
      pantry: true,
    },
    from: {
      code: 'NZM',
      name: 'Hazrat Nizamuddin',
      departure: '16:55',
      day: 1,
      platform: '5',
    },
    to: {
      code: 'CSMT',
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      arrival: '11:15',
      day: 2,
      platform: '18',
    },
    distance: 1537,
    duration: 1100, // 18h 20m
    totalHaltsBetween: 7,
    halts: [
      { stationCode: 'GWL', stationName: 'Gwalior Junction', arrival: '20:08', departure: '20:10', haltMinutes: 2, distanceKm: 306, day: 1 },
      { stationCode: 'VGLJ', stationName: 'V Lakshmibai Jhansi', arrival: '21:28', departure: '21:33', haltMinutes: 5, distanceKm: 403, day: 1 },
      { stationCode: 'BPL', stationName: 'Bhopal Junction', arrival: '00:35', departure: '00:40', haltMinutes: 5, distanceKm: 695, day: 2 },
      { stationCode: 'JL', stationName: 'Jalgaon Junction', arrival: '05:53', departure: '05:55', haltMinutes: 2, distanceKm: 1118, day: 2 },
      { stationCode: 'NK', stationName: 'Nashik Road', arrival: '08:13', departure: '08:15', haltMinutes: 2, distanceKm: 1351, day: 2 },
      { stationCode: 'KYN', stationName: 'Kalyan Junction', arrival: '10:13', departure: '10:15', haltMinutes: 2, distanceKm: 1485, day: 2 },
    ],
  },
  {
    train: {
      number: '12926',
      name: 'Paschim SF Express',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['1A', '2A', '3A', 'SL', 'GEN'],
      pantry: true,
    },
    from: {
      code: 'NDLS',
      name: 'New Delhi',
      departure: '16:35',
      day: 1,
      platform: '6',
    },
    to: {
      code: 'BDTS',
      name: 'Bandra Terminus',
      arrival: '14:55',
      day: 2,
      platform: '4',
    },
    distance: 1366,
    duration: 1340, // 22h 20m
    totalHaltsBetween: 34,
  },
  {
    train: {
      number: '12215',
      name: 'Delhi Sarai Rohilla - BDTS Garib Rath Express',
      type: 'Garib Rath',
      runDays: ['MON', 'TUE', 'THU', 'SAT'],
      classes: ['3A', 'CC'],
      pantry: false,
    },
    from: {
      code: 'DEE',
      name: 'Delhi Sarai Rohilla',
      departure: '08:55',
      day: 1,
      platform: '1',
    },
    to: {
      code: 'BDTS',
      name: 'Bandra Terminus',
      arrival: '07:35',
      day: 2,
      platform: '5',
    },
    distance: 1431,
    duration: 1360, // 22h 40m
    totalHaltsBetween: 18,
  },
  {
    train: {
      number: '12216',
      name: 'BDTS - Delhi Sarai Rohilla Garib Rath Express',
      type: 'Garib Rath',
      runDays: ['TUE', 'WED', 'FRI', 'SUN'],
      classes: ['3A', 'CC'],
      pantry: false,
    },
    from: {
      code: 'BDTS',
      name: 'Bandra Terminus',
      departure: '12:00',
      day: 1,
      platform: '5',
    },
    to: {
      code: 'DEE',
      name: 'Delhi Sarai Rohilla',
      arrival: '11:00',
      day: 2,
      platform: '2',
    },
    distance: 1431,
    duration: 1380, // 23h 0m
    totalHaltsBetween: 18,
  },
  {
    train: {
      number: '12248',
      name: 'NZM BDTS Yuva Express',
      type: 'Duronto',
      runDays: ['SAT'],
      classes: ['CC', '3A'],
      pantry: true,
    },
    from: {
      code: 'NZM',
      name: 'Hazrat Nizamuddin',
      departure: '16:30',
      day: 1,
      platform: '4',
    },
    to: {
      code: 'BDTS',
      name: 'Bandra Terminus',
      arrival: '09:15',
      day: 2,
      platform: '3',
    },
    distance: 1366,
    duration: 1005, // 16h 45m
    totalHaltsBetween: 5,
  },
  {
    train: {
      number: '09004',
      name: 'New Delhi - Mumbai Central Festival Special',
      type: 'Special',
      runDays: ['MON', 'THU'],
      classes: ['2A', '3A', 'SL'],
      pantry: false,
    },
    from: {
      code: 'NDLS',
      name: 'New Delhi',
      departure: '23:55',
      day: 1,
      platform: '14',
    },
    to: {
      code: 'MMCT',
      name: 'Mumbai Central',
      arrival: '21:30',
      day: 2,
      platform: '3',
    },
    distance: 1384,
    duration: 1295, // 21h 35m
    totalHaltsBetween: 14,
  },
  {
    train: {
      number: '12138',
      name: 'Punjab Mail',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['1A', '2A', '3A', 'SL'],
      pantry: true,
    },
    from: {
      code: 'NDLS',
      name: 'New Delhi',
      departure: '05:15',
      day: 1,
      platform: '1',
    },
    to: {
      code: 'CSMT',
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      arrival: '07:35',
      day: 2,
      platform: '15',
    },
    distance: 1541,
    duration: 1580, // 26h 20m
    totalHaltsBetween: 48,
  },

  // ==========================================
  // ROUTE 2: DELHI (NDLS/DEC/DEE) -> JAIPUR (JP)
  // ==========================================
  {
    train: {
      number: '20978',
      name: 'Ajmer Vande Bharat Express',
      type: 'Vande Bharat',
      runDays: ['MON', 'TUE', 'THU', 'FRI', 'SAT', 'SUN'], // Runs 6 days, no Wed
      classes: ['CC', 'EC'],
      pantry: true,
    },
    from: {
      code: 'DEC',
      name: 'Delhi Cantt',
      departure: '06:20',
      day: 1,
      platform: '1',
    },
    to: {
      code: 'JP',
      name: 'Jaipur Junction',
      arrival: '10:05',
      day: 1,
      platform: '2',
    },
    distance: 298,
    duration: 225, // 3h 45m
    totalHaltsBetween: 3,
    halts: [
      { stationCode: 'GGN', stationName: 'Gurgaon', arrival: '06:38', departure: '06:40', haltMinutes: 2, distanceKm: 17, day: 1 },
      { stationCode: 'RE', stationName: 'Rewari Junction', arrival: '07:22', departure: '07:24', haltMinutes: 2, distanceKm: 68, day: 1 },
      { stationCode: 'AWR', stationName: 'Alwar Junction', arrival: '08:18', departure: '08:20', haltMinutes: 2, distanceKm: 143, day: 1 },
      { stationCode: 'GADJ', stationName: 'Gandhinagar Jaipur', arrival: '09:50', departure: '09:52', haltMinutes: 2, distanceKm: 293, day: 1 },
      { stationCode: 'JP', stationName: 'Jaipur Junction', arrival: '10:05', departure: '10:05', haltMinutes: 0, distanceKm: 298, day: 1 },
    ],
  },
  {
    train: {
      number: '12015',
      name: 'Ajmer Shatabdi Express',
      type: 'Shatabdi',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['CC', 'EC'],
      pantry: true,
    },
    from: {
      code: 'NDLS',
      name: 'New Delhi',
      departure: '06:10',
      day: 1,
      platform: '2',
    },
    to: {
      code: 'JP',
      name: 'Jaipur Junction',
      arrival: '10:40',
      day: 1,
      platform: '3',
    },
    distance: 308,
    duration: 270, // 4h 30m
    totalHaltsBetween: 5,
  },
  {
    train: {
      number: '12986',
      name: 'Delhi Sarai Rohilla - Jaipur AC Double Decker',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['CC'],
      pantry: false,
    },
    from: {
      code: 'DEE',
      name: 'Delhi Sarai Rohilla',
      departure: '17:35',
      day: 1,
      platform: '3',
    },
    to: {
      code: 'JP',
      name: 'Jaipur Junction',
      arrival: '22:00',
      day: 1,
      platform: '1',
    },
    distance: 303,
    duration: 265, // 4h 25m
    totalHaltsBetween: 6,
  },
  {
    train: {
      number: '12414',
      name: 'Jammu Tawi - Ajmer Pooja SF Express',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['2A', '3A', 'SL'],
      pantry: false,
    },
    from: {
      code: 'DLI',
      name: 'Old Delhi Junction',
      departure: '04:15',
      day: 1,
      platform: '11',
    },
    to: {
      code: 'JP',
      name: 'Jaipur Junction',
      arrival: '09:45',
      day: 1,
      platform: '4',
    },
    distance: 308,
    duration: 330, // 5h 30m
    totalHaltsBetween: 9,
  },
  {
    train: {
      number: '14311',
      name: 'Ala Hazrat Express (via Ahmedabad)',
      type: 'Express',
      runDays: ['TUE', 'THU', 'SAT'],
      classes: ['2A', '3A', 'SL'],
      pantry: false,
    },
    from: {
      code: 'DLI',
      name: 'Old Delhi Junction',
      departure: '11:45',
      day: 1,
      platform: '5',
    },
    to: {
      code: 'JP',
      name: 'Jaipur Junction',
      arrival: '18:00',
      day: 1,
      platform: '2',
    },
    distance: 308,
    duration: 375, // 6h 15m
    totalHaltsBetween: 15,
  },

  // ==========================================
  // ROUTE 3: MUMBAI (CSMT/DR/LTT) -> PUNE (PUNE)
  // ==========================================
  {
    train: {
      number: '22225',
      name: 'Solapur Vande Bharat Express',
      type: 'Vande Bharat',
      runDays: ['MON', 'TUE', 'WED', 'FRI', 'SAT', 'SUN'], // No Thu
      classes: ['CC', 'EC'],
      pantry: true,
    },
    from: {
      code: 'CSMT',
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      departure: '16:05',
      day: 1,
      platform: '10',
    },
    to: {
      code: 'PUNE',
      name: 'Pune Junction',
      arrival: '19:10',
      day: 1,
      platform: '2',
    },
    distance: 192,
    duration: 185, // 3h 05m
    totalHaltsBetween: 3,
    halts: [
      { stationCode: 'DR', stationName: 'Dadar', arrival: '16:15', departure: '16:17', haltMinutes: 2, distanceKm: 9, day: 1 },
      { stationCode: 'TNA', stationName: 'Thane', arrival: '16:38', departure: '16:40', haltMinutes: 2, distanceKm: 34, day: 1 },
      { stationCode: 'KYN', stationName: 'Kalyan Junction', arrival: '16:58', departure: '17:00', haltMinutes: 2, distanceKm: 54, day: 1 },
      { stationCode: 'PUNE', stationName: 'Pune Junction', arrival: '19:10', departure: '19:10', haltMinutes: 0, distanceKm: 192, day: 1 },
    ],
  },
  {
    train: {
      number: '12123',
      name: 'Deccan Queen Superfast Express',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['CC', '2S'],
      pantry: true,
    },
    from: {
      code: 'CSMT',
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      departure: '17:10',
      day: 1,
      platform: '9',
    },
    to: {
      code: 'PUNE',
      name: 'Pune Junction',
      arrival: '20:25',
      day: 1,
      platform: '1',
    },
    distance: 192,
    duration: 195, // 3h 15m
    totalHaltsBetween: 4,
  },
  {
    train: {
      number: '12127',
      name: 'Mumbai - Pune Intercity SF Express',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['CC', '2S'],
      pantry: false,
    },
    from: {
      code: 'CSMT',
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      departure: '06:40',
      day: 1,
      platform: '8',
    },
    to: {
      code: 'PUNE',
      name: 'Pune Junction',
      arrival: '09:57',
      day: 1,
      platform: '3',
    },
    distance: 192,
    duration: 197, // 3h 17m
    totalHaltsBetween: 5,
  },
  {
    train: {
      number: '11007',
      name: 'Deccan Express',
      type: 'Express',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['CC', '2S'],
      pantry: false,
    },
    from: {
      code: 'CSMT',
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      departure: '07:00',
      day: 1,
      platform: '7',
    },
    to: {
      code: 'PUNE',
      name: 'Pune Junction',
      arrival: '11:05',
      day: 1,
      platform: '4',
    },
    distance: 192,
    duration: 245, // 4h 05m
    totalHaltsBetween: 10,
  },
  {
    train: {
      number: '12125',
      name: 'Pragati SF Express',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['CC', '2S'],
      pantry: false,
    },
    from: {
      code: 'CSMT',
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      departure: '16:25',
      day: 1,
      platform: '12',
    },
    to: {
      code: 'PUNE',
      name: 'Pune Junction',
      arrival: '19:50',
      day: 1,
      platform: '2',
    },
    distance: 192,
    duration: 205, // 3h 25m
    totalHaltsBetween: 5,
  },
  {
    train: {
      number: '11009',
      name: 'Sinhagad Express',
      type: 'Express',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['CC', '2S'],
      pantry: false,
    },
    from: {
      code: 'CSMT',
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      departure: '17:50',
      day: 1,
      platform: '8',
    },
    to: {
      code: 'PUNE',
      name: 'Pune Junction',
      arrival: '21:50',
      day: 1,
      platform: '3',
    },
    distance: 192,
    duration: 240, // 4h 00m
    totalHaltsBetween: 9,
  },
  {
    train: {
      number: '51401',
      name: 'Mumbai - Pune Passenger',
      type: 'Passenger',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['GEN'],
      pantry: false,
    },
    from: {
      code: 'CSMT',
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      departure: '22:30',
      day: 1,
      platform: '5',
    },
    to: {
      code: 'PUNE',
      name: 'Pune Junction',
      arrival: '04:10',
      day: 2,
      platform: '5',
    },
    distance: 192,
    duration: 340, // 5h 40m
    totalHaltsBetween: 26,
  },

  // ==========================================
  // ROUTE 4: CHENNAI (MAS/MS) -> BENGALURU (SBC/SMVB/YPR)
  // ==========================================
  {
    train: {
      number: '20607',
      name: 'Mysuru Vande Bharat Express',
      type: 'Vande Bharat',
      runDays: ['MON', 'TUE', 'THU', 'FRI', 'SAT', 'SUN'], // No Wed
      classes: ['CC', 'EC'],
      pantry: true,
    },
    from: {
      code: 'MAS',
      name: 'MGR Chennai Central',
      departure: '05:50',
      day: 1,
      platform: '2A',
    },
    to: {
      code: 'SBC',
      name: 'KSR Bengaluru City Junction',
      arrival: '10:15',
      day: 1,
      platform: '7',
    },
    distance: 359,
    duration: 265, // 4h 25m
    totalHaltsBetween: 2,
    halts: [
      { stationCode: 'KPD', stationName: 'Katpadi Junction', arrival: '07:13', departure: '07:15', haltMinutes: 2, distanceKm: 130, day: 1 },
      { stationCode: 'BNC', stationName: 'Bengaluru Cantt', arrival: '10:00', departure: '10:02', haltMinutes: 2, distanceKm: 355, day: 1 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru City', arrival: '10:15', departure: '10:15', haltMinutes: 0, distanceKm: 359, day: 1 },
    ],
  },
  {
    train: {
      number: '12027',
      name: 'KSR Bengaluru Shatabdi Express',
      type: 'Shatabdi',
      runDays: ['MON', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], // No Tue
      classes: ['CC', 'EC'],
      pantry: true,
    },
    from: {
      code: 'MAS',
      name: 'MGR Chennai Central',
      departure: '17:30',
      day: 1,
      platform: '1',
    },
    to: {
      code: 'SBC',
      name: 'KSR Bengaluru City Junction',
      arrival: '22:25',
      day: 1,
      platform: '1',
    },
    distance: 359,
    duration: 295, // 4h 55m
    totalHaltsBetween: 3,
  },
  {
    train: {
      number: '12639',
      name: 'Brindavan SF Express',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['CC', '2S'],
      pantry: false,
    },
    from: {
      code: 'MAS',
      name: 'MGR Chennai Central',
      departure: '07:10',
      day: 1,
      platform: '3',
    },
    to: {
      code: 'SBC',
      name: 'KSR Bengaluru City Junction',
      arrival: '13:05',
      day: 1,
      platform: '2',
    },
    distance: 359,
    duration: 355, // 5h 55m
    totalHaltsBetween: 11,
  },
  {
    train: {
      number: '12607',
      name: 'Lalbagh SF Express',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['CC', '2S'],
      pantry: false,
    },
    from: {
      code: 'MAS',
      name: 'MGR Chennai Central',
      departure: '15:30',
      day: 1,
      platform: '4',
    },
    to: {
      code: 'SBC',
      name: 'KSR Bengaluru City Junction',
      arrival: '21:35',
      day: 1,
      platform: '3',
    },
    distance: 359,
    duration: 365, // 6h 05m
    totalHaltsBetween: 11,
  },
  {
    train: {
      number: '12657',
      name: 'Chennai - Bengaluru SF Mail',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['1A', '2A', '3A', 'SL'],
      pantry: false,
    },
    from: {
      code: 'MAS',
      name: 'MGR Chennai Central',
      departure: '22:50',
      day: 1,
      platform: '6',
    },
    to: {
      code: 'SBC',
      name: 'KSR Bengaluru City Junction',
      arrival: '04:30',
      day: 2,
      platform: '1',
    },
    distance: 359,
    duration: 340, // 5h 40m
    totalHaltsBetween: 6,
  },
  {
    train: {
      number: '22353',
      name: 'SMVB SF Express',
      type: 'Superfast',
      runDays: ['FRI'],
      classes: ['2A', '3A', 'SL'],
      pantry: false,
    },
    from: {
      code: 'MAS',
      name: 'MGR Chennai Central',
      departure: '13:45',
      day: 1,
      platform: '5',
    },
    to: {
      code: 'SMVB',
      name: 'Sir M. Visvesvaraya Terminal Bengaluru',
      arrival: '19:40',
      day: 1,
      platform: '2',
    },
    distance: 354,
    duration: 355, // 5h 55m
    totalHaltsBetween: 5,
  },

  // ==========================================
  // ROUTE 5: KOLKATA (HWH/SDAH) -> DELHI (NDLS/DLI/ANVT)
  // ==========================================
  {
    train: {
      number: '12301',
      name: 'Howrah Rajdhani Express (via Gaya)',
      type: 'Rajdhani',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'], // 6 days
      classes: ['1A', '2A', '3A'],
      pantry: true,
    },
    from: {
      code: 'HWH',
      name: 'Howrah Junction',
      departure: '16:50',
      day: 1,
      platform: '9',
    },
    to: {
      code: 'NDLS',
      name: 'New Delhi',
      arrival: '10:05',
      day: 2,
      platform: '12',
    },
    distance: 1451,
    duration: 1035, // 17h 15m
    totalHaltsBetween: 7,
    halts: [
      { stationCode: 'ASN', stationName: 'Asansol Junction', arrival: '18:57', departure: '19:00', haltMinutes: 3, distanceKm: 200, day: 1 },
      { stationCode: 'DHN', stationName: 'Dhanbad Junction', arrival: '19:55', departure: '20:00', haltMinutes: 5, distanceKm: 259, day: 1 },
      { stationCode: 'GAYA', stationName: 'Gaya Junction', arrival: '22:31', departure: '22:34', haltMinutes: 3, distanceKm: 459, day: 1 },
      { stationCode: 'DDU', stationName: 'Pt. Deen Dayal Upadhyaya', arrival: '00:45', departure: '00:55', haltMinutes: 10, distanceKm: 664, day: 2 },
      { stationCode: 'PRYJ', stationName: 'Prayagraj Junction', arrival: '02:43', departure: '02:45', haltMinutes: 2, distanceKm: 817, day: 2 },
      { stationCode: 'CNB', stationName: 'Kanpur Central', arrival: '04:50', departure: '04:55', haltMinutes: 5, distanceKm: 1011, day: 2 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrival: '10:05', departure: '10:05', haltMinutes: 0, distanceKm: 1451, day: 2 },
    ],
  },
  {
    train: {
      number: '12305',
      name: 'Howrah Rajdhani Express (via Patna)',
      type: 'Rajdhani',
      runDays: ['SUN'],
      classes: ['1A', '2A', '3A'],
      pantry: true,
    },
    from: {
      code: 'HWH',
      name: 'Howrah Junction',
      departure: '14:05',
      day: 1,
      platform: '8',
    },
    to: {
      code: 'NDLS',
      name: 'New Delhi',
      arrival: '10:05',
      day: 2,
      platform: '12',
    },
    distance: 1530,
    duration: 1200, // 20h 00m
    totalHaltsBetween: 9,
  },
  {
    train: {
      number: '12273',
      name: 'Howrah - New Delhi Duronto Express',
      type: 'Duronto',
      runDays: ['MON', 'FRI'],
      classes: ['1A', '2A', '3A', 'SL'],
      pantry: true,
    },
    from: {
      code: 'HWH',
      name: 'Howrah Junction',
      departure: '12:50',
      day: 1,
      platform: '10',
    },
    to: {
      code: 'NDLS',
      name: 'New Delhi',
      arrival: '06:25',
      day: 2,
      platform: '11',
    },
    distance: 1445,
    duration: 1055, // 17h 35m
    totalHaltsBetween: 4,
  },
  {
    train: {
      number: '12313',
      name: 'Sealdah Rajdhani Express',
      type: 'Rajdhani',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['1A', '2A', '3A'],
      pantry: true,
    },
    from: {
      code: 'SDAH',
      name: 'Sealdah',
      departure: '16:50',
      day: 1,
      platform: '12',
    },
    to: {
      code: 'NDLS',
      name: 'New Delhi',
      arrival: '10:50',
      day: 2,
      platform: '14',
    },
    distance: 1458,
    duration: 1080, // 18h 00m
    totalHaltsBetween: 6,
  },
  {
    train: {
      number: '12303',
      name: 'Poorva Express',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'FRI', 'SAT'],
      classes: ['1A', '2A', '3A', 'SL'],
      pantry: true,
    },
    from: {
      code: 'HWH',
      name: 'Howrah Junction',
      departure: '08:00',
      day: 1,
      platform: '9',
    },
    to: {
      code: 'NDLS',
      name: 'New Delhi',
      arrival: '06:00',
      day: 2,
      platform: '8',
    },
    distance: 1530,
    duration: 1320, // 22h 00m
    totalHaltsBetween: 24,
  },
  {
    train: {
      number: '12311',
      name: 'Netaji Express',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['1A', '2A', '3A', 'SL'],
      pantry: true,
    },
    from: {
      code: 'HWH',
      name: 'Howrah Junction',
      departure: '21:55',
      day: 1,
      platform: '13',
    },
    to: {
      code: 'DLI',
      name: 'Old Delhi Junction',
      arrival: '20:55',
      day: 2,
      platform: '7',
    },
    distance: 1449,
    duration: 1380, // 23h 00m
    totalHaltsBetween: 38,
  },

  // ==========================================
  // ROUTE 6: HYDERABAD (HYB/SC) -> MUMBAI (CSMT/LTT)
  // ==========================================
  {
    train: {
      number: '12702',
      name: 'Hussain Sagar SF Express',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['1A', '2A', '3A', 'SL'],
      pantry: false,
    },
    from: {
      code: 'HYB',
      name: 'Hyderabad Deccan',
      departure: '14:50',
      day: 1,
      platform: '4',
    },
    to: {
      code: 'CSMT',
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      arrival: '04:55',
      day: 2,
      platform: '14',
    },
    distance: 790,
    duration: 845, // 14h 05m
    totalHaltsBetween: 15,
  },
  {
    train: {
      number: '17032',
      name: 'Hyderabad - Mumbai CSMT Express',
      type: 'Express',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['2A', '3A', 'SL'],
      pantry: false,
    },
    from: {
      code: 'HYB',
      name: 'Hyderabad Deccan',
      departure: '20:40',
      day: 1,
      platform: '5',
    },
    to: {
      code: 'CSMT',
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      arrival: '13:05',
      day: 2,
      platform: '16',
    },
    distance: 790,
    duration: 985, // 16h 25m
    totalHaltsBetween: 23,
  },
  {
    train: {
      number: '12219',
      name: 'Secunderabad - LTT Duronto Express',
      type: 'Duronto',
      runDays: ['TUE', 'FRI'],
      classes: ['1A', '2A', '3A', 'SL'],
      pantry: true,
    },
    from: {
      code: 'SC',
      name: 'Secunderabad Junction',
      departure: '23:05',
      day: 1,
      platform: '1',
    },
    to: {
      code: 'LTT',
      name: 'Lokmanya Tilak Terminus',
      arrival: '11:10',
      day: 2,
      platform: '2',
    },
    distance: 771,
    duration: 725, // 12h 05m
    totalHaltsBetween: 3,
  },
  {
    train: {
      number: '18519',
      name: 'Visakhapatnam - LTT Express (via Secunderabad)',
      type: 'Express',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['2A', '3A', 'SL'],
      pantry: false,
    },
    from: {
      code: 'SC',
      name: 'Secunderabad Junction',
      departure: '12:55',
      day: 1,
      platform: '6',
    },
    to: {
      code: 'LTT',
      name: 'Lokmanya Tilak Terminus',
      arrival: '04:15',
      day: 2,
      platform: '4',
    },
    distance: 771,
    duration: 920, // 15h 20m
    totalHaltsBetween: 17,
  },

  // ==========================================
  // ROUTE 7: AHMEDABAD (ADI) -> MUMBAI (MMCT/BDTS/CSMT)
  // ==========================================
  {
    train: {
      number: '20902',
      name: 'Mumbai Central Vande Bharat Express',
      type: 'Vande Bharat',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'], // No Sun
      classes: ['CC', 'EC'],
      pantry: true,
    },
    from: {
      code: 'ADI',
      name: 'Ahmedabad Junction',
      departure: '15:00',
      day: 1,
      platform: '1',
    },
    to: {
      code: 'MMCT',
      name: 'Mumbai Central',
      arrival: '20:25',
      day: 1,
      platform: '5',
    },
    distance: 493,
    duration: 325, // 5h 25m
    totalHaltsBetween: 5,
    halts: [
      { stationCode: 'BRC', stationName: 'Vadodara Junction', arrival: '15:53', departure: '15:56', haltMinutes: 3, distanceKm: 100, day: 1 },
      { stationCode: 'ST', stationName: 'Surat', arrival: '17:13', departure: '17:16', haltMinutes: 3, distanceKm: 229, day: 1 },
      { stationCode: 'VAPI', stationName: 'Vapi', arrival: '18:13', departure: '18:15', haltMinutes: 2, distanceKm: 324, day: 1 },
      { stationCode: 'BVI', stationName: 'Borivali', arrival: '19:32', departure: '19:34', haltMinutes: 2, distanceKm: 463, day: 1 },
      { stationCode: 'MMCT', stationName: 'Mumbai Central', arrival: '20:25', departure: '20:25', haltMinutes: 0, distanceKm: 493, day: 1 },
    ],
  },
  {
    train: {
      number: '12010',
      name: 'Mumbai Central Shatabdi Express',
      type: 'Shatabdi',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'], // No Sun
      classes: ['CC', 'EC'],
      pantry: true,
    },
    from: {
      code: 'ADI',
      name: 'Ahmedabad Junction',
      departure: '14:50',
      day: 1,
      platform: '2',
    },
    to: {
      code: 'MMCT',
      name: 'Mumbai Central',
      arrival: '21:20',
      day: 1,
      platform: '1',
    },
    distance: 493,
    duration: 390, // 6h 30m
    totalHaltsBetween: 8,
  },
  {
    train: {
      number: '12932',
      name: 'Ahmedabad - Mumbai Central Double Decker',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'], // No Sun
      classes: ['CC'],
      pantry: false,
    },
    from: {
      code: 'ADI',
      name: 'Ahmedabad Junction',
      departure: '06:00',
      day: 1,
      platform: '6',
    },
    to: {
      code: 'MMCT',
      name: 'Mumbai Central',
      arrival: '13:05',
      day: 1,
      platform: '3',
    },
    distance: 493,
    duration: 425, // 7h 05m
    totalHaltsBetween: 10,
  },
  {
    train: {
      number: '12972',
      name: 'Bhavnagar - BDTS SF Express',
      type: 'Superfast',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['1A', '2A', '3A', 'SL'],
      pantry: false,
    },
    from: {
      code: 'ADI',
      name: 'Ahmedabad Junction',
      departure: '23:45',
      day: 1,
      platform: '4',
    },
    to: {
      code: 'BDTS',
      name: 'Bandra Terminus',
      arrival: '08:15',
      day: 2,
      platform: '1',
    },
    distance: 480,
    duration: 510, // 8h 30m
    totalHaltsBetween: 12,
  },
  {
    train: {
      number: '19036',
      name: 'Intercity Express (ADI - BRC)',
      type: 'Local',
      runDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      classes: ['CC', 'GEN'],
      pantry: false,
    },
    from: {
      code: 'ADI',
      name: 'Ahmedabad Junction',
      departure: '18:00',
      day: 1,
      platform: '3',
    },
    to: {
      code: 'BRC',
      name: 'Vadodara Junction',
      arrival: '19:55',
      day: 1,
      platform: '1',
    },
    distance: 100,
    duration: 115, // 1h 55m
    totalHaltsBetween: 7,
  },
];
