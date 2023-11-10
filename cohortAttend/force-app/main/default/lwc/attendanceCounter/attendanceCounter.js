import { LightningElement, api } from 'lwc';

export default class AttendanceCounter extends LightningElement {
    @api totalAttendance = 0;  // Assuming totalAttendance is a number
    @api attendanceRecords = [];

    connectedCallback() {
        // Hardcode some sample data for testing
        this.attendanceRecords = [
            { date: '2023-01-01', totalAttendance: 10 },
            { date: '2023-01-02', totalAttendance: 15 },
            // Add more records as needed
        ];
    }

    get sortedRecords() {
        console.log('Sorting attendance records:', this.attendanceRecords);
        if (Array.isArray(this.attendanceRecords)) {
            return this.attendanceRecords.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        return [];
    }
}
