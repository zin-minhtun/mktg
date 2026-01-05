import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useUserData } from '../../Contexts/UserContext';
import { useTheme } from '../../Contexts/ThemeContext';
import dayjs from 'dayjs';
import axios from 'axios';
import { API_URL } from '@env';
import { useFocusEffect } from '@react-navigation/native';

// Import components
import JournalOutlookCard from '../../Screens/Dashboard/Cards/JournalOutlookCard';
import StatsCard from '../../Screens/Dashboard/Cards/StatsCard';
import UpgradeCard from '../../Screens/Dashboard/Cards/UpgradeCard';

// Import icons
import {
  LifestyleIcon,
  MedicationsIcon,
  MoodIcon,
  NotesIcon,
  PainIcon,
  SleepIcon,
  SymptomsIcon
} from '../../Screens/Dashboard/Icons/JournalIcons';

const Dashboard = ({ navigation }) => {
  const { gUser } = useUserData();
  const { theme } = useTheme();
  const isDarkMode = theme.background === '#00192F';
  const [statMetric, setStatMetric] = useState('weight');
  const [timeframe, setTimeframe] = useState('daily');
  const [currentDate] = useState(dayjs());
  const [currentJournalIndex, setCurrentJournalIndex] = useState(0); // Start with Lifestyle
  const [isLoading, setIsLoading] = useState(true);

  // State for all data
  const [allData, setAllData] = useState({});

  // Define metric options for future expansion with correct endpoints
  const metricOptions = [
    { id: 'weight', title: 'Weight (Kg)', model: 'bodyComposition', endpoint: '/api/v1/body-compositions', valueField: 'weight', hasGetEndpoint: true },
    { id: 'fluidIntake', title: 'Fluid Intake (ml)', model: 'hydration', endpoint: '/api/v1/hydration', valueField: 'amount', hasGetEndpoint: false },
    { id: 'pain', title: 'Pain Level', model: 'pain', endpoint: '/api/pains', valueField: 'intensity', hasGetEndpoint: true },
    { id: 'mood', title: 'Mood', model: 'mood', endpoint: '/api/moods', valueField: 'moodScale', hasGetEndpoint: true },
    { id: 'sleep', title: 'Sleep Hours', model: 'sleep', endpoint: '/api/v1/sleep', valueField: 'sleepHours', hasGetEndpoint: false },
    { id: 'exercise', title: 'Exercise', model: 'exercise', endpoint: '/api/v1/exercises', valueField: 'duration', hasGetEndpoint: true },
    { id: 'socialActivity', title: 'Social Activity', model: 'socialActivity', endpoint: '/api/v1/social-activities', valueField: 'duration', hasGetEndpoint: true },
    { id: 'medications', title: 'Medications', model: 'medications', endpoint: '/api/meds/records', valueField: 'dosage', hasGetEndpoint: true },
  ];

  // Screen dimensions
  const screenWidth = Dimensions.get('window').width;

  // Colors - Updated to use theme and match design screenshot
  const colors = {
    background: theme.background,
    cardBackground: isDarkMode ? '#00192F' : '#FFFFFF',
    primaryBlue: '#00B8DF',
    lightBlue: isDarkMode ? '#002A4A' : '#E6F7FB',
    textPrimary: isDarkMode ? '#E0E0E0' : theme.textColor,
    textSecondary: isDarkMode ? '#9BA3AF' : '#6E7682',
    highlight: isDarkMode ? '#FFFFFF' : '#00192F',
    headerBackground: theme.background,
    journalCardBackground: isDarkMode ? '#00192F' : '#FFFFFF',
    statsCardBackground: isDarkMode ? '#00192F' : '#FFFFFF',
    journalOuterBackground: isDarkMode ? '#001527' : '#E6F7FB',
    upgradeBackground: isDarkMode ? '#001527' : '#F4F4F4',
    buttonBackground: '#00B8DF',
    buttonText: '#FFFFFF',
    waveBackground: isDarkMode ? '#002A4A' : '#E6F7FB',
    navArrow: isDarkMode ? '#00B8DF' : '#ADB5BD',
    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : theme.borderColor,
    chartGrid: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E0E0E0',
  };

  // Mock journal data (with correctly colored icons)
  const journalCategories = [
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      icon: <LifestyleIcon size={30} color={isDarkMode ? '#00B8DF' : '#00192F'} />,
      summary: 'Sedentary, occasional smoking',
    },
    {
      id: 'medications',
      title: 'Medications',
      icon: <MedicationsIcon size={30} color={isDarkMode ? '#00B8DF' : '#00192F'} />,
      summary: 'Omeprazole (20mg, twice daily)',
    },
    {
      id: 'mood',
      title: 'Mood',
      icon: <MoodIcon size={30} color={isDarkMode ? '#00B8DF' : '#00192F'} />,
      summary: 'Anxious (7/10)',
    },
    {
      id: 'notes',
      title: 'Notes',
      icon: <NotesIcon size={30} color={isDarkMode ? '#00B8DF' : '#00192F'} />,
      summary: 'I woke up feeling butterflies in my tummy and...',
    },
    {
      id: 'pain',
      title: 'Pain',
      icon: <PainIcon size={30} color={isDarkMode ? '#00B8DF' : '#00192F'} />,
      summary: 'Moderate abdominal pain (6/10)',
    },
    {
      id: 'sleep',
      title: 'Sleep',
      icon: <SleepIcon size={30} color={isDarkMode ? '#00B8DF' : '#00192F'} />,
      summary: '6 hours of sleep last night, difficulty falling asleep',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      icon: <SymptomsIcon size={30} color={isDarkMode ? '#00B8DF' : '#00192F'} />,
      summary: 'Nausea, butterflies in the tummy, fatigue',
    },
  ];

  // API URL for data fetching
  // const API_URL = process.env.API_URL || "http://192.168.2.17:5000";
  const HTTP_TIMEOUT = 10000;

  // States for data
  const [notesData, setNotesData] = useState(null);
  const [weightData, setWeightData] = useState({
    daily: {
      data: [],
      peak: { day: '', value: 0 }
    },
    weekly: {
      data: [],
      peak: { week: '', value: 0 }
    },
    monthly: {
      data: [],
      peak: { month: '', value: 0 }
    }
  });

  const [fluidIntakeData, setFluidIntakeData] = useState({
    daily: {
      data: [],
      peak: { day: '', value: 0 }
    },
    weekly: {
      data: [],
      peak: { week: '', value: 0 }
    },
    monthly: {
      data: [],
      peak: { month: '', value: 0 }
    }
  });

  // Data fetching
  // Data fetching with auto-refresh on focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        const userId = getUserId();
        if (userId) {
          if (isActive) await fetchData(userId);
        } else {
          if (isActive) {
            loadMockData();
            setIsLoading(false);
          }
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [gUser]) // Re-run if user changes
  );

  // Data handling functions 
  const getUserId = () => {
    if (!gUser) return null;
    return gUser._id || gUser.id || gUser.uid;
  };

  const loadMockData = () => {
    // Create example data
    const generateMockData = (metric) => {
      if (metric === 'weight') {
        return {
          daily: {
            data: [
              { day: 'MON', value: 89 },
              { day: 'TUE', value: 87 },
              { day: 'WED', value: 85 },
              { day: 'THU', value: 88 },
              { day: 'FRI', value: 92 },
              { day: 'SAT', value: 87 },
              { day: 'SUN', value: 90 }
            ],
            peak: { day: 'Friday', value: 92 }
          },
          weekly: {
            data: [
              { week: 'Week 1', value: 87 },
              { week: 'Week 2', value: 89 },
              { week: 'Week 3', value: 88 },
              { week: 'Week 4', value: 90 }
            ],
            peak: { week: 'Week 4', value: 90 }
          },
          monthly: {
            data: [
              { month: 'Jan', value: 86 },
              { month: 'Feb', value: 87 },
              { month: 'Mar', value: 89 },
              { month: 'Apr', value: 88 },
              { month: 'May', value: 90 },
              { month: 'Jun', value: 89 }
            ],
            peak: { month: 'May', value: 90 }
          }
        };
      } else if (metric === 'fluidIntake') {
        return {
          daily: {
            data: [
              { day: 'MON', value: 65 },
              { day: 'TUE', value: 70 },
              { day: 'WED', value: 62 },
              { day: 'THU', value: 68 },
              { day: 'FRI', value: 75 },
              { day: 'SAT', value: 67 },
              { day: 'SUN', value: 72 }
            ],
            peak: { day: 'Friday', value: 75 }
          },
          weekly: {
            data: [
              { week: 'Week 1', value: 68 },
              { week: 'Week 2', value: 72 },
              { week: 'Week 3', value: 65 },
              { week: 'Week 4', value: 70 }
            ],
            peak: { week: 'Week 2', value: 72 }
          },
          monthly: {
            data: [
              { month: '4 MO\nAGO', value: 68 },
              { month: '3 MO\nAGO', value: 72 },
              { month: '2 MO\nAGO', value: 75 },
              { month: '1 MO\nAGO', value: 70 },
              { month: 'THIS\nMONTH', value: 75 }
            ],
            difference: '+2 liters from last month'
          }
        };
      }
      // Default placeholder data for other metrics
      return {
        daily: {
          data: Array(7).fill().map((_, i) => ({
            day: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i],
            value: Math.floor(Math.random() * 100)
          })),
          peak: { day: 'Friday', value: 75 }
        },
        weekly: {
          data: Array(4).fill().map((_, i) => ({
            week: `Week ${i + 1}`,
            value: Math.floor(Math.random() * 100)
          })),
          peak: { week: 'Week 2', value: 85 }
        },
        monthly: {
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
            month,
            value: Math.floor(Math.random() * 100)
          })),
          peak: { month: 'May', value: 90 }
        }
      };
    };

    // Create sample data for all metrics
    setWeightData(generateMockData('weight'));
    setFluidIntakeData(generateMockData('fluidIntake'));

    // Collect all metrics in one state
    const allMetricData = {};
    metricOptions.forEach(metric => {
      allMetricData[metric.id] = generateMockData(metric.id);
    });

    setAllData(allMetricData);
    setNotesData({
      text: "I woke up feeling butterflies in my tummy and...",
      date: new Date()
    });
  };

  // fetchData function
  const fetchData = async (userId) => {
    setIsLoading(true);
    try {
      // Test API connection first
      try {
        const pingResponse = await axios.get(`${API_URL}/api/v1/users/ping`);
        console.log("API ping response:", pingResponse.data);
      } catch (pingError) {
        console.error("API ping failed:", pingError);
        throw new Error("API server not available");
      }

      // Fetch all metrics data
      const promises = metricOptions.map(metric => fetchMetricData(userId, metric));
      await Promise.all(promises);

      // Additional specific data fetches (like notes)
      await fetchNotesData(userId);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Load mock data as fallback
      loadMockData();
      setIsLoading(false);
    }
  };

  // Generic function to fetch data for any metric
  const fetchMetricData = async (userId, metricConfig) => {
    try {
      console.log(`Fetching ${metricConfig.model} data...`);

      // Skip API call if endpoint doesn't have a GET route implemented
      if (!metricConfig.hasGetEndpoint) {
        console.log(`No GET endpoint available for ${metricConfig.model} - using mock data`);
        // We set mock data only if we haven't already populated it with real data (or for consistency)
        // But logic below returns processed data to map.
        // We'll return mock structure here to fill gaps.
        const mock = createEmptyDataStructure();
        // Or better, just rely on allData state update in loadMockData if we want hybrid. 
        // For now, let's return a generated mock data for this specific metric
        // But to keep consistency with "mock-only" vs "real", we should rely on loadMockData filling the gaps if fetchData fails/skips.
        // However, fetchData clears/overwrites state. We should merge or ensure loadMockData runs partially?
        // Actually, let's just use the loadMockData generator for this specific item.
        const mockData = generateMockDataForMetric(metricConfig.id);

        // Update allData state for this metric
        setAllData(prev => ({
          ...prev,
          [metricConfig.id]: mockData
        }));
        return mockData;
      }

      let url = `${API_URL}${metricConfig.endpoint}`;
      let params = { userId };

      // Special handling for routes requiring /user/:userId or similar patterns
      if (metricConfig.id === 'pain' || metricConfig.id === 'mood') {
        url = `${API_URL}${metricConfig.endpoint}/user/${userId}`;
        params = {};
      } else if (metricConfig.id === 'medications') {
        url = `${API_URL}${metricConfig.endpoint}/${userId}`;
        params = {};
      }

      console.log(`Attempting to fetch from: ${url}`, params);

      const response = await axios.get(url, {
        params,
        timeout: HTTP_TIMEOUT
      });

      console.log(`${metricConfig.model} response:`, response.data);

      if (response.data && (Array.isArray(response.data) || (response.data.status === 'Success' || response.data.success) && (response.data.data !== undefined))) {
        // Process data based on metric type
        let processedData;
        let responseData = Array.isArray(response.data) ? response.data : response.data.data;

        if (!Array.isArray(responseData)) {
          console.warn(`Expected array data for ${metricConfig.model} but got`, typeof responseData);
          responseData = [];
        }

        if (metricConfig.id === 'weight') {
          processedData = processWeightData(responseData);
          setWeightData(processedData);
        } else if (metricConfig.id === 'fluidIntake') {
          processedData = processFluidIntakeData(responseData);
          setFluidIntakeData(processedData);
        } else {
          // Generic data processing for other metrics
          processedData = processGenericData(responseData, metricConfig.valueField);
        }

        // Update allData state
        setAllData(prev => ({
          ...prev,
          [metricConfig.id]: processedData
        }));

        return processedData;
      }

      // If response is not as expected, return empty data structure
      console.warn(`Unexpected API response format for ${metricConfig.model} data:`, response.data);
      const empty = createEmptyDataStructure();
      setAllData(prev => ({ ...prev, [metricConfig.id]: empty }));
      return empty;

    } catch (error) {
      console.error(`Error fetching ${metricConfig.model} data:`, error.message);
      if (error.response) {
        console.error(`Server responded with status ${error.response.status}:`, error.response.data);
      }

      // Return mock data on error so the dashboard isn't empty
      const mockData = generateMockDataForMetric(metricConfig.id);
      setAllData(prev => ({
        ...prev,
        [metricConfig.id]: mockData
      }));
      return mockData;
    }
  };

  // Helper to generate mock data for a single metric
  const generateMockDataForMetric = (metricId) => {
    // Re-use logic from loadMockData but isolated
    // (This duplicates logic slightly but ensures safety without full refactor)
    // Ideally move generateMockData outside loadMockData

    const getRandomValue = () => Math.floor(Math.random() * 100);

    if (metricId === 'weight') {
      return {
        daily: { data: Array(7).fill().map((_, i) => ({ day: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i], value: 85 + Math.floor(Math.random() * 10) })), peak: { day: 'FRI', value: 95 } },
        weekly: { data: Array(4).fill().map((_, i) => ({ week: `Week ${i + 1}`, value: 87 + Math.floor(Math.random() * 5) })), peak: { week: 'Week 4', value: 90 } },
        monthly: { data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => ({ month: m, value: 85 + Math.floor(Math.random() * 10) })), peak: { month: 'May', value: 90 } }
      };
    }

    return {
      daily: {
        data: Array(7).fill().map((_, i) => ({
          day: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i],
          value: getRandomValue()
        })),
        peak: { day: 'Friday', value: 75 }
      },
      weekly: {
        data: Array(4).fill().map((_, i) => ({
          week: `Week ${i + 1}`,
          value: getRandomValue()
        })),
        peak: { week: 'Week 2', value: 85 }
      },
      monthly: {
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
          month,
          value: getRandomValue()
        })),
        peak: { month: 'May', value: 90 }
      }
    };
  };

  // Create empty data structure for a metric
  const createEmptyDataStructure = () => {
    return {
      daily: { data: [], peak: { day: '', value: 0 } },
      weekly: { data: [], peak: { week: '', value: 0 } },
      monthly: { data: [], peak: { month: '', value: 0 } }
    };
  };

  // Generic data processing function for any metric
  const processGenericData = (rawData, valueField) => {
    // If no data is available, return empty structures
    if (!rawData || rawData.length === 0) {
      return createEmptyDataStructure();
    }

    // Sort data by date (newest first)
    const sortedData = [...rawData].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt);
      const dateB = new Date(b.date || b.createdAt);
      return dateB - dateA;
    });

    // Process for daily view (last 7 days)
    const last7Days = sortedData.slice(0, 7);
    const dailyData = last7Days.map(entry => {
      const date = new Date(entry.date || entry.createdAt);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      return { day: dayName, value: entry[valueField] || 0 }; // Default to 0 if field missing
    }).reverse(); // Reverse to show oldest to newest

    // Find peak for daily
    const dailyPeak = dailyData.reduce(
      (max, entry) => entry.value > max.value ? entry : max,
      { day: '', value: 0 }
    );

    // Process for weekly view (last 4 weeks)
    const weeklyGroups = {};
    sortedData.forEach(entry => {
      const date = new Date(entry.date || entry.createdAt);
      if (isNaN(date.getTime())) return;

      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyGroups[weekKey]) {
        weeklyGroups[weekKey] = [];
      }
      weeklyGroups[weekKey].push(entry);
    });

    // Calculate weekly averages
    const weeklyData = Object.keys(weeklyGroups).slice(0, 4).map((weekKey, index) => {
      const weekEntries = weeklyGroups[weekKey];
      const sum = weekEntries.reduce((s, e) => s + (e[valueField] || 0), 0);
      const weekAvg = sum / weekEntries.length;
      return { week: `Week ${4 - index}`, value: parseFloat(weekAvg.toFixed(1)) };
    }).reverse();

    // Find peak for weekly
    const weeklyPeak = weeklyData.reduce(
      (max, entry) => entry.value > max.value ? entry : max,
      { week: '', value: 0 }
    );

    // Process for monthly view (last 6 months)
    const monthlyGroups = {};
    sortedData.forEach(entry => {
      const date = new Date(entry.date || entry.createdAt);
      if (isNaN(date.getTime())) return;

      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = [];
      }
      monthlyGroups[monthKey].push(entry);
    });

    // Calculate monthly averages
    const monthKeys = Object.keys(monthlyGroups).sort().reverse().slice(0, 6);
    const monthlyData = monthKeys.map(monthKey => {
      const [year, month] = monthKey.split('-');
      const monthName = new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short' });
      const monthEntries = monthlyGroups[monthKey];
      const sum = monthEntries.reduce((s, e) => s + (e[valueField] || 0), 0);
      const monthAvg = sum / monthEntries.length;
      return { month: monthName, value: parseFloat(monthAvg.toFixed(1)) };
    }).reverse();

    // Find peak for monthly
    const monthlyPeak = monthlyData.reduce(
      (max, entry) => entry.value > max.value ? entry : max,
      { month: '', value: 0 }
    );

    return {
      daily: { data: dailyData, peak: dailyPeak },
      weekly: { data: weeklyData, peak: weeklyPeak },
      monthly: { data: monthlyData, peak: monthlyPeak }
    };
  };

  // Fetch notes data from the backend
  const fetchNotesData = async (userId) => {
    try {
      // In a real implementation, you would fetch from your API
      // const response = await axios.get(`${API_URL}/api/v1/notes`, {
      //   params: { userId },
      //   timeout: HTTP_TIMEOUT
      // });
      // setNotesData(response.data);

      // For now, using mock data
      setNotesData({
        text: "I woke up feeling butterflies in my tummy and...",
        date: new Date()
      });
    } catch (error) {
      console.error("Error fetching notes data:", error);
      throw error;
    }
  };

  // Process raw weight data into format needed for charts
  const processWeightData = (rawData) => {
    // If no data is available, return empty structures
    if (!rawData || rawData.length === 0) {
      return {
        daily: { data: [], peak: { day: '', value: 0 } },
        weekly: { data: [], peak: { week: '', value: 0 } },
        monthly: { data: [], peak: { month: '', value: 0 } }
      };
    }

    // Sort data by date (newest first)
    const sortedData = [...rawData].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt);
      const dateB = new Date(b.date || b.createdAt);
      return dateB - dateA;
    });

    // Process for daily view (last 7 days)
    const last7Days = sortedData.slice(0, 7);
    const dailyData = last7Days.map(entry => {
      const date = new Date(entry.date || entry.createdAt);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      return { day: dayName, value: entry.weight };
    }).reverse(); // Reverse to show oldest to newest

    // Find peak for daily
    const dailyPeak = dailyData.reduce(
      (max, entry) => entry.value > max.value ? entry : max,
      { day: '', value: 0 }
    );

    // Process for weekly view (last 4 weeks)
    // Group data by week
    const weeklyGroups = {};
    sortedData.forEach(entry => {
      const date = new Date(entry.date || entry.createdAt);
      if (isNaN(date.getTime())) return; // skip invalid dates

      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyGroups[weekKey]) {
        weeklyGroups[weekKey] = [];
      }
      weeklyGroups[weekKey].push(entry);
    });

    // Calculate weekly averages
    const weeklyData = Object.keys(weeklyGroups).slice(0, 4).map((weekKey, index) => {
      const weekEntries = weeklyGroups[weekKey];
      const weekAvg = weekEntries.reduce((sum, entry) => sum + entry.weight, 0) / weekEntries.length;
      return { week: `Week ${4 - index}`, value: parseFloat(weekAvg.toFixed(1)) };
    }).reverse();

    // Find peak for weekly
    const weeklyPeak = weeklyData.reduce(
      (max, entry) => entry.value > max.value ? entry : max,
      { week: '', value: 0 }
    );

    // Process for monthly view (last 6 months)
    // Group data by month
    const monthlyGroups = {};
    sortedData.forEach(entry => {
      const date = new Date(entry.date || entry.createdAt);
      if (isNaN(date.getTime())) return;

      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = [];
      }
      monthlyGroups[monthKey].push(entry);
    });

    // Calculate monthly averages
    const monthKeys = Object.keys(monthlyGroups).sort().reverse().slice(0, 6);
    const monthlyData = monthKeys.map(monthKey => {
      const [year, month] = monthKey.split('-');
      const monthName = new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short' });
      const monthEntries = monthlyGroups[monthKey];
      const monthAvg = monthEntries.reduce((sum, entry) => sum + entry.weight, 0) / monthEntries.length;
      return { month: monthName, value: parseFloat(monthAvg.toFixed(1)) };
    }).reverse();

    // Find peak for monthly
    const monthlyPeak = monthlyData.reduce(
      (max, entry) => entry.value > max.value ? entry : max,
      { month: '', value: 0 }
    );

    return {
      daily: { data: dailyData, peak: dailyPeak },
      weekly: { data: weeklyData, peak: weeklyPeak },
      monthly: { data: monthlyData, peak: monthlyPeak }
    };
  };

  // Process raw fluid intake data into format needed for charts
  const processFluidIntakeData = (rawData) => {
    // If no data is available, return empty structures
    if (!rawData || rawData.length === 0) {
      return {
        daily: { data: [], peak: { day: '', value: 0 } },
        weekly: { data: [], peak: { week: '', value: 0 } },
        monthly: { data: [], peak: { month: '', value: 0 } }
      };
    }
    // Sort data by date (newest first)
    const sortedData = [...rawData].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Process for daily view (last 7 days)
    const last7Days = sortedData.slice(0, 7);
    const dailyData = last7Days.map(entry => {
      const date = new Date(entry.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      return { day: dayName, value: entry.amount };
    }).reverse(); // Reverse to show oldest to newest

    // Find peak for daily
    const dailyPeak = dailyData.reduce(
      (max, entry) => entry.value > max.value ? entry : max,
      { day: '', value: 0 }
    );

    // Process for weekly view (last 4 weeks)
    // Group data by week
    const weeklyGroups = {};
    sortedData.forEach(entry => {
      const date = new Date(entry.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyGroups[weekKey]) {
        weeklyGroups[weekKey] = [];
      }
      weeklyGroups[weekKey].push(entry);
    });

    // Calculate weekly totals
    const weeklyData = Object.keys(weeklyGroups).slice(0, 4).map((weekKey, index) => {
      const weekEntries = weeklyGroups[weekKey];
      const weekTotal = weekEntries.reduce((sum, entry) => sum + entry.amount, 0);
      return { week: `Week ${4 - index}`, value: parseFloat(weekTotal.toFixed(1)) };
    }).reverse();

    // Find peak for weekly
    const weeklyPeak = weeklyData.reduce(
      (max, entry) => entry.value > max.value ? entry : max,
      { week: '', value: 0 }
    );

    // Process for monthly view (last 6 months)
    // Group data by month
    const monthlyGroups = {};
    sortedData.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = [];
      }
      monthlyGroups[monthKey].push(entry);
    });

    // Calculate monthly totals
    const monthKeys = Object.keys(monthlyGroups).sort().reverse().slice(0, 5);
    const monthlyData = monthKeys.map((monthKey, index) => {
      let label;
      if (index === 0) {
        label = "THIS\nMONTH";
      } else {
        label = `${index}\nMO\nAGO`;
      }

      const monthEntries = monthlyGroups[monthKey];
      const monthTotal = monthEntries.reduce((sum, entry) => sum + entry.amount, 0);
      return { month: label, value: parseFloat(monthTotal.toFixed(1)) };
    }).reverse();

    // Calculate difference from last month if available
    let difference = "";
    if (monthlyData.length >= 2) {
      const thisMonth = monthlyData[monthlyData.length - 1].value;
      const lastMonth = monthlyData[monthlyData.length - 2].value;
      const diff = thisMonth - lastMonth;
      difference = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)} milliliters from last month`;
    }

    return {
      daily: { data: dailyData, peak: dailyPeak },
      weekly: { data: weeklyData, peak: weeklyPeak },
      monthly: { data: monthlyData, difference }
    };
  };

  // Navigation functions
  const navigateToPreviousJournal = () => {
    setCurrentJournalIndex(prev =>
      prev === 0 ? journalCategories.length - 1 : prev - 1
    );
  };

  const navigateToNextJournal = () => {
    setCurrentJournalIndex(prev =>
      prev === journalCategories.length - 1 ? 0 : prev + 1
    );
  };

  const navigateToPreviousMetric = () => {
    const currentIndex = metricOptions.findIndex(m => m.id === statMetric);
    const newIndex = currentIndex <= 0 ? metricOptions.length - 1 : currentIndex - 1;
    setStatMetric(metricOptions[newIndex].id);
  };

  const navigateToNextMetric = () => {
    const currentIndex = metricOptions.findIndex(m => m.id === statMetric);
    const newIndex = currentIndex >= metricOptions.length - 1 ? 0 : currentIndex + 1;
    setStatMetric(metricOptions[newIndex].id);
  };

  // Data retrieval functions
  const getCurrentData = () => {
    if (allData && allData[statMetric] && allData[statMetric][timeframe]) {
      return allData[statMetric][timeframe];
    }

    if (statMetric === 'weight') {
      return weightData[timeframe] || { data: [], peak: { value: 0 } };
    } else if (statMetric === 'fluidIntake') {
      return fluidIntakeData[timeframe] || { data: [], peak: { value: 0 } };
    }

    return { data: [], peak: { value: 0 } };
  };

  const handleGoToJournal = () => {
    const category = journalCategories[currentJournalIndex];
    navigation.navigate('Journal', { screen: category.id });
  };

  const getMaxValue = () => {
    const currentData = getCurrentData();
    if (!currentData || !currentData.data || currentData.data.length === 0) {
      return 100;
    }

    const values = currentData.data.map(item => item.value);
    const max = Math.max(...values);
    return max > 0 ? max : 100;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.headerBackground}
      />

      {/* Header */}
      <View style={{ padding: 16 }}>
        <Text style={{
          fontSize: 14,
          color: colors.textSecondary,
          marginBottom: 8
        }}>
          {currentDate.format('dddd, DD MMMM YYYY')}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../../../assets/images/avatar.jpg')}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }}
          />
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary
          }}>
            Dashboard
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Journal Outlook Card */}
        <JournalOutlookCard
          colors={colors}
          journalCategories={journalCategories}
          currentJournalIndex={currentJournalIndex}
          navigateToPreviousJournal={navigateToPreviousJournal}
          navigateToNextJournal={navigateToNextJournal}
          handleGoToJournal={handleGoToJournal}
          notesData={notesData}
          isDarkMode={isDarkMode}
        />

        {/* My Stats Card */}
        <StatsCard
          colors={colors}
          statMetric={statMetric}
          timeframe={timeframe}
          navigateToPreviousMetric={navigateToPreviousMetric}
          navigateToNextMetric={navigateToNextMetric}
          setTimeframe={setTimeframe}
          isLoading={isLoading}
          metricOptions={metricOptions}
          getCurrentData={getCurrentData}
          getMaxValue={getMaxValue}
          isDarkMode={isDarkMode}
        />

        {/* Upgrade Plan Section */}
        <UpgradeCard colors={colors} isDarkMode={isDarkMode} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;