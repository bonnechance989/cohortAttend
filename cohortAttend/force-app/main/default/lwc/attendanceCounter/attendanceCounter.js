import { LightningElement, api } from 'lwc';

export default class AttendanceCounter extends LightningElement {
    @api totalAttendance = 0;  
    @api attendanceRecords = [];

    get sortedRecords() {
        console.log('Sorting attendance records:', this.attendanceRecords);
        if (Array.isArray(this.attendanceRecords)) {
            return this.attendanceRecords.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        return [];
    }
}
