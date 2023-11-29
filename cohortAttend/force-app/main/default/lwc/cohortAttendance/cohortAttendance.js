import { LightningElement, track, api } from 'lwc';
import unmarkContactPresent from '@salesforce/apex/CohortAttendanceController.unmarkContactPresent';
import getWorshipCohortContacts from '@salesforce/apex/CohortAttendanceController.getWorshipCohortContacts';
//import createAndMarkContact from '@salesforce/apex/CohortAttendanceController.createAndMarkContact';
import markContactPresent from '@salesforce/apex/CohortAttendanceController.markContactPresent';
import createWorshipAttendanceRecord from '@salesforce/apex/CohortAttendanceController.createWorshipAttendanceRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class WorshipServiceAttendance extends LightningElement {
    @track contacts = [];
    @track newFirstName = '';
    @track newLastName = '';
    @api serviceDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
    @track totalAttendance = 0; 
    @track attendanceRecords = [];
    errorMessage = '';

    connectedCallback() {
        this.fetchContacts();
    }

    fetchContacts() {
        console.log('fetchContacts called');
        getWorshipCohortContacts({ serviceDate: this.serviceDate })
        .then(result => {
            console.log('Contacts fetched:', result);
            this.contacts = [...result].sort((a, b) => a.LastName.localeCompare(b.LastName));
            console.log('Sorted contacts:', this.contacts);
            this.updateTotalAttendance();
        })
        .catch(error => this.handleErrors(error));
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

        markContactPresent({ contactId: contactId, serviceDate: this.serviceDate })
        .then(() => {
            // this.showToast('Success', 'Contact marked as present', 'success');
            this.updateTotalAttendance();
        })
        .catch(error => this.handleErrors(error));
    }

    // handleCreateContact() {
    //     if (this.newFirstName && this.newLastName) {
    //         createAndMarkContact({ 
    //             firstName: this.newFirstName, 
    //             lastName: this.newLastName, 
    //             serviceDate: this.serviceDate 
    //         })
    //         .then(() => {
    //             this.newFirstName = '';
    //             this.newLastName = '';
    //             return this.fetchContacts(); // Fetch contacts again to refresh the list
    //         })
    //         .then(() => {
    //             this.updateTotalAttendance(); // Update total attendance after the list is refreshed
    //             this.showToast('Success', 'New contact added and marked as present', 'success');
    //         })
    //         .catch(error => {
    //             this.handleErrors(error);
    //         });
    //     } else {
    //         this.showToast('Error', 'Please enter both first and last name', 'error');
    //     }
    // }

    handleDateChange(event) {
        this.serviceDate = event.target.value;
        this.fetchContacts(); // Optionally refresh the list based on the new date
    }

    handleTotalAttendanceChange(event) {
        this.totalAttendance = parseInt(event.target.value, 10);
    }

    handleDoneMarkingAttendance() {
        createWorshipAttendanceRecord({ serviceDate: this.serviceDate, totalAttendance: this.totalAttendance })
        .then(result => {
            this.showToast('Success', 'Worship Service record created', 'success');
            // Additional actions after creating the record
        })
        .catch(error => {
            this.showToast('Error', 'Error creating Worship Service record: ' + error.body.message, 'error');
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
