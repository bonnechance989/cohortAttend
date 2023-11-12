import { LightningElement, wire, api } from 'lwc';
import getWorshipServiceRecords from '@salesforce/apex/CohortAttendanceController.getWorshipServiceRecords';
export default class AttendanceCounter extends LightningElement {
    @api totalAttendance = 0;  
    @wire(getWorshipServiceRecords) attendanceRecords;

    get sortedRecords() {
        if (this.attendanceRecords.data) {
            return this.attendanceRecords.data.map(record => ({
                date: record.Date__c,
                totalAttendance: record.Number_in_Attendance__c
            }));
        }
        return [];
    }
}

