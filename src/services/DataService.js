// Mock API service for server-side data operations
export class DataService {
    constructor() {
        // Third server API configuration
        this.thirdServerAPI = 'http://172.16.9.98:8000/api/v1/rundown/server3/today';
        
        // Extended sample data
        this.data = [
            { id: 1, type: "Live", date: "2025-08-13", programme: "Morning News & Updates", duration: "2h", stage: "Stage 1", server: "primary" },
            { id: 2, type: "Recorded", date: "2025-08-13", programme: "Sports Highlights", duration: "1h", stage: "Stage 2", server: "primary" },
            { id: 3, type: "Live", date: "2025-08-13", programme: "Evening Talk Show", duration: "1.5h", stage: "Stage 1", server: "primary" },
            { id: 4, type: "Scheduled", date: "2025-08-14", programme: "Documentary Special", duration: "3h", stage: "Stage 2", server: "secondary" },
            { id: 5, type: "Ready", date: "2025-08-14", programme: "Weather Update", duration: "30min", stage: "Stage 1", server: "secondary" },
            { id: 6, type: "Live", date: "2025-08-15", programme: "Breaking News", duration: "45min", stage: "Stage 1", server: "secondary" },
            { id: 7, type: "Recorded", date: "2025-08-15", programme: "Music Show", duration: "2h", stage: "Stage 2", server: "third" },
            { id: 8, type: "Live", date: "2025-08-16", programme: "Late Night Show", duration: "1h", stage: "Stage 1", server: "third" },
            { id: 9, type: "Scheduled", date: "2025-08-16", programme: "Movie Marathon", duration: "4h", stage: "Stage 2", server: "third" },
            { id: 10, type: "Ready", date: "2025-08-17", programme: "Comedy Hour", duration: "1h", stage: "Stage 1", server: "fourth" },
            { id: 11, type: "Live", date: "2025-08-17", programme: "Tech Review", duration: "2h", stage: "Stage 2", server: "fourth" },
            { id: 12, type: "Recorded", date: "2025-08-17", programme: "Cooking Show", duration: "1.5h", stage: "Stage 1", server: "fourth" },
            { id: 13, type: "Scheduled", date: "2025-08-18", programme: "Game Show", duration: "2h", stage: "Stage 2", server: "primary" },
            { id: 14, type: "Live", date: "2025-08-18", programme: "Travel Guide", duration: "1h", stage: "Stage 1", server: "primary" },
            { id: 15, type: "Ready", date: "2025-08-19", programme: "Health & Wellness", duration: "45min", stage: "Stage 2", server: "secondary" },
            { id: 16, type: "Recorded", date: "2025-08-19", programme: "Fashion Week", duration: "3h", stage: "Stage 1", server: "secondary" },
            { id: 17, type: "Live", date: "2025-08-20", programme: "Business Today", duration: "1.5h", stage: "Stage 2", server: "third" },
            { id: 18, type: "Scheduled", date: "2025-08-20", programme: "Science Discoveries", duration: "2h", stage: "Stage 1", server: "third" },
            { id: 19, type: "Ready", date: "2025-08-21", programme: "Art Gallery", duration: "1h", stage: "Stage 2", server: "fourth" },
            { id: 20, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 21, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 22, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 23, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 24, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 25, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 26, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 27, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 28, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 29, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 30, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 31, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 32, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 33, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 34, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 35, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 36, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 37, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 38, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 39, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 40, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 41, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 42, type: "Live", date: "2025-08-21", programme: "Political Debate", duration: "2.5h", stage: "Stage 1", server: "fourth" },
            { id: 43, type: "red", date: "2025-08-14", programme: "Emergency Broadcast", duration: "30min", stage: "Stage 1", server: "third" },
            { id: 44, type: "PGM", date: "2025-08-14", programme: "Main Programme", duration: "1h", stage: "Played", server: "third" },
            { id: 45, type: "red", date: "2025-08-14", programme: "Critical Alert", duration: "15min", stage: "Stage 2", server: "secondary" }



        ];
    }

    // Fetch data from the third server API
    async fetchThirdServerData() {
        try {
            const response = await fetch(this.thirdServerAPI);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const apiData = await response.json();
            
            // Transform API data to match our data structure
            const transformedData = apiData.data.map((item, index) => ({
                id: index + 1,
                type: item.label, // "PGM", "PROMO", etc.
                date: new Date(item.starttime).toISOString().split('T')[0], // Extract date from datetime
                programme: item.name,
                duration: item.timecode,
                status: item.status === "Running" ? "Running" : (item.status === "Played" ? "Played" : "Upcoming"),
                server: "third",
                starttime: item.starttime,
                timecode: item.timecode //if type === LIVE_*** wild card the colum should red
            }));

            return transformedData;
        } catch (error) {
            console.error('Error fetching third server data:', error);
            // Return mock data if API fails
            return this.data.filter(item => item.server === "third");
        }
    }

    // Simulate server-side filtering, sorting, and pagination
    async fetchData({
        page = 1,
        pageSize = 15,
        search = '',
        sortField = 'id',
        sortDirection = 'asc',
        server = 'all',
        filters = {}
    }) {

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

        let filteredData = [...this.data];

        // Apply server filter
        if (server && server !== 'all') {
            filteredData = filteredData.filter(item => item.server === server);
        }

        // Apply additional filters
        if (filters.type && filters.type !== '') {
            filteredData = filteredData.filter(item => item.type === filters.type);
        }
        if (filters.stage && filters.stage !== '') {
            filteredData = filteredData.filter(item => item.stage === filters.stage);
        }
        if (filters.date && filters.date !== '') {
            filteredData = filteredData.filter(item => item.date === filters.date);
        }

        // Apply search
        if (search) {
            const searchLower = search.toLowerCase();
            filteredData = filteredData.filter(item =>
                item.programme.toLowerCase().includes(searchLower) ||
                item.type.toLowerCase().includes(searchLower) ||
                item.stage.toLowerCase().includes(searchLower)
            );
        }

        // Apply sorting
        filteredData.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            // Handle different data types
            if (sortField === 'date') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            } else if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        // Calculate pagination
        const totalRecords = filteredData.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        return {
            data: paginatedData,
            totalRecords,
            currentPage: page,
            pageSize,
            totalPages: Math.ceil(totalRecords / pageSize)
        };
    }

    // Get server-specific data
    async fetchServerData(serverName, options = {}) {
        // Use API for third server
        if (serverName === 'third') {
            try {
                // Fetch from API
                const apiData = await this.fetchThirdServerData();
                
                // Apply filtering, sorting, and pagination to API data
                return await this.processServerData(apiData, options);
            } catch (error) {
                console.error('Error with third server API, falling back to mock data:', error);
                // Fallback to mock data
                return this.fetchData({
                    ...options,
                    server: serverName
                });
            }
        }
        
        // Use mock data for other servers
        return this.fetchData({
            ...options,
            server: serverName
        });
    }

    // Process server data with filtering, sorting, and pagination
    async processServerData(data, {
        page = 1,
        pageSize = 15,
        search = '',
        sortField = 'id',
        sortDirection = 'asc',
        filters = {}
    } = {}) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

        let filteredData = [...data];

        // Apply additional filters
        if (filters.type && filters.type !== '') {
            filteredData = filteredData.filter(item => item.type === filters.type);
        }
        if (filters.status && filters.status !== '') {
            filteredData = filteredData.filter(item => item.status === filters.status);
        }
        if (filters.date && filters.date !== '') {
            filteredData = filteredData.filter(item => item.date === filters.date);
        }

        // Apply search
        if (search) {
            const searchLower = search.toLowerCase();
            filteredData = filteredData.filter(item =>
                item.programme.toLowerCase().includes(searchLower) ||
                item.type.toLowerCase().includes(searchLower) ||
                item.status.toLowerCase().includes(searchLower)
            );
        }

        // Apply sorting
        filteredData.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            // Handle different data types
            if (sortField === 'date') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            } else if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        // Calculate pagination
        const totalRecords = filteredData.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        return {
            data: paginatedData,
            totalRecords,
            currentPage: page,
            pageSize,
            totalPages: Math.ceil(totalRecords / pageSize)
        };
    }

    // Get summary statistics
    async getSummaryStats() {
        const total = this.data.length;
        const byServer = this.data.reduce((acc, item) => {
            acc[item.server] = (acc[item.server] || 0) + 1;
            return acc;
        }, {});

        return {
            total,
            byServer
        };
    }
}

export const dataService = new DataService();
