import { LightningElement, wire, track, api } from 'lwc';
import createGroupAttendanceRecord  from '@salesforce/apex/CohortAttendanceController.createGroupAttendanceRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class basicAttendanceComponent extends LightningElement {
    @track groupNameInput;
    @track meetingDate;
    @track attendanceTotalInput;

    handleGroupNameChange(event) {
        this.groupNameInput = event.target.value;
    }

    handleDateChange(event) {
        this.meetingDate = event.target.value;
    }

    handleAttendanceChange(event) {
        this.attendanceTotalInput = event.target.value;
    }

    addRecord() {
        const VALID_GROUP_NAMES = ['Group 1', 'Group 2', 'Group 3'];
        const validGroupNamesString = VALID_GROUP_NAMES.join(', '); // Convert array to a string
    
        if (!VALID_GROUP_NAMES.includes(this.groupNameInput)) {
            // Invalid group name, show error toast with valid group names
            this.showToast('Error', `Invalid group name. Accepted names are: ${validGroupNamesString}`, 'error');
            return; // Exit the function
        }

        const attendanceTotal = parseInt(this.attendanceTotalInput, 10);   //using parseInt because it might give me a string, and 10 for base 10
        createGroupAttendanceRecord({
            groupNameInput: this.groupNameInput, 
            meetingDate: this.meetingDate, 
            attendanceTotalInput: attendanceTotal
        })
        
        .then(result => {
            this.showToast('Success', 'Attendance record created', 'success');
        })
        .catch(error => {
            this.showToast('Error', `Error creating attendance record: ${error.body.message}`, 'error');
        });
    }
        showToast(title, message, variant) {
            const event = new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
            });
            this.dispatchEvent(event);
        }
}


