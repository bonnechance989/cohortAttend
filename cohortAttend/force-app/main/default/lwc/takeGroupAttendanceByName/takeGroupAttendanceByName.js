import { LightningElement, track, api } from 'lwc';
import unmarkContactInGroupPresent from '@salesforce/apex/CohortAttendanceController.unmarkContactInGroupPresent';
import getContactsInGroup1 from '@salesforce/apex/CohortAttendanceController.getContactsInGroup1';
import getContactsInGroup2 from '@salesforce/apex/CohortAttendanceController.getContactsInGroup2';
import getContactsInGroup3 from '@salesforce/apex/CohortAttendanceController.getContactsInGroup3';
import markContactInGroupPresent from '@salesforce/apex/CohortAttendanceController.markContactInGroupPresent';
import createGroupAttendanceRecord from '@salesforce/apex/CohortAttendanceController.createGroupAttendanceRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class takeGroupAttendanceByName extends LightningElement {
    @track contacts = [];
    @track groupNameInput = '';
    @api meetingDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
    @track totalAttendance = 0; 
    @track attendanceRecords = [];
    errorMessage = '';

    connectedCallback() {
        
    }
    fetchContacts() {
        if (this.groupNameInput === 'Group 1') {
            getContactsInGroup1({ meetingDate: this.meetingDate })
                .then(result => {
                    this.contacts = result;
                    this.updateTotalAttendance();
                })
                .catch(error => this.handleErrors(error));
        } 
        else if (this.groupNameInput === 'Group 2') {
            getContactsInGroup2({ meetingDate: this.meetingDate })
                .then(result => {
                    this.contacts = result;
                    this.updateTotalAttendance();
                })
                .catch(error => this.handleErrors(error));
        } 
        else if (this.groupNameInput === 'Group 3') {
            getContactsInGroup3({ meetingDatete: this.meetingDate })
                .then(result => {
                    this.contacts = result;
                    this.updateTotalAttendance();
                })
                .catch(error => this.handleErrors(error));
        }
    }
    handleGroupNameChange(event) {
        this.groupNameInput = event.target.value;
        this.fetchContacts(); // Fetch contacts based on the selected group
    }
    updateTotalAttendance() {
        console.log('Updating total attendance');
        this.totalAttendance = this.contacts.filter(contact => contact.Present__c).length;
        console.log('Total attendance:', this.totalAttendance);
    }

    handleFirstNameChange(event) {
        this.newFirstName = event.target.value;
    }

    handleLastNameChange(event) {
        this.newLastName = event.target.value;
    }

    handlePresenceChange(event) {
        const contactId = event.target.dataset.id;
        const present = event.target.checked;

        this.contacts = this.contacts.map(contact => {
            if (contact.Id === contactId) {
                return {...contact, Present__c: present};
            }
            return contact;
        });

        if (present) {
            markContactInGroupPresent({ contactId: contactId, meetingDate: this.meetingDate, groupName: this.groupNameInput})
            .then(() => {
                this.updateTotalAttendance();
            })
            .catch(error => this.handleErrors(error));
        } else {
            unmarkContactInGroupPresent({ contactId: contactId })
            .then(() => {
                this.updateTotalAttendance();
            })
            .catch(error => this.handleErrors(error));
        }
    }

    handleDateChange(event) {
        this.meetingDate = event.target.value;
        this.fetchContacts(); // Optionally refresh the list based on the new date
    }

    handleTotalAttendanceChange(event) {
        this.totalAttendance = parseInt(event.target.value, 10);
    }

    handleDoneMarkingAttendance() {
        createGroupAttendanceRecord({ 
            meetingDate: this.meetingDate, 
            attendanceTotalInput: this.totalAttendance, 
            groupNameInput: this.groupNameInput 
        })
        .then(result => {
            this.showToast('Success', 'Attendance record created', 'success');
        })
        .catch(error => {
            this.showToast('Error', 'Error creating attendance record: ' + error.body.message, 'error');
        });
    }

    handleErrors(error) {
        console.error('Error:', error);
        this.errorMessage = error.message || 'Unknown error';
        this.showToast('Error', this.errorMessage, 'error');
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
