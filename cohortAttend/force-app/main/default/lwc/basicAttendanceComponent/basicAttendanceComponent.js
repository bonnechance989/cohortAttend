import { LightningElement, wire, track, api } from 'lwc';
import addGroupAttendanceRecord from '@salesforce/apex/CohortAttendanceController.addGroupAttendanceRecord';

export default class basicAttendanceComponent extends LightningElement {
    @track groupNameInput;
    @track input1;
    @track attendanceTotalInput;

    handleGroupNameChange(event) {
        this.groupNameInput = event.target.value;
    }

    handleDateChange(event) {
        this.input1 = event.target.value;
    }

    handleAttendanceChange(event) {
        this.attendanceTotalInput = event.target.value;
    }

    addRecord() {
        console.log('Adding Record with:', {
            groupNameInput: this.groupNameInput, 
            input1: this.input1, 
            attendanceTotalInput: this.attendanceTotalInput
        });

       
        const attendanceTotal = parseInt(this.attendanceTotalInput, 10);   //using parseInt because it might give me a string, and 10 for base 10

        addGroupAttendanceRecord({ 
            groupNameInput: this.groupNameInput, 
            input1: this.input1, 
            attendanceTotalInput: attendanceTotal
        })
        .then(result => {
            console.log('Record Added Successfully:', result);
        })
        .catch(error => {
            console.error('Error in Adding Record:', error);
        });
    }
}
