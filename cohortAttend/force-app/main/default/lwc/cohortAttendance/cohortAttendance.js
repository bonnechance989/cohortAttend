import { LightningElement, wire, track, api } from 'lwc';
import unmarkContactPresent from '@salesforce/apex/CohortAttendanceController.unmarkContactPresent';
import getWorshipCohortContacts from '@salesforce/apex/CohortAttendanceController.getWorshipCohortContacts';
import createAndMarkContact from '@salesforce/apex/CohortAttendanceController.createAndMarkContact';
import markContactPresent from '@salesforce/apex/CohortAttendanceController.markContactPresent';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class WorshipServiceAttendance extends LightningElement {
    @track contacts = [];
    @track newFirstName = '';
    @track newLastName = '';
    @api serviceDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
    errorMessage = '';

    connectedCallback() {
        this.fetchContacts();
    }

    fetchContacts() {
        getWorshipCohortContacts({ serviceDate: this.serviceDate })
        .then(result => {
            this.contacts = result;
        })
        .catch(error => this.handleErrors(error));
    }

    handlePresenceChange(event) {
        const contactId = event.target.dataset.id;
        const present = event.target.checked;

        if (present) {
            markContactPresent({ contactId: contactId, serviceDate: this.serviceDate })
            .then(() => {
                this.showToast('Success', 'Contact marked as present', 'success');
                this.fetchContacts();
            })
            .catch(error => this.handleErrors(error));
        } else {
            unmarkContactPresent({ contactId: contactId })
            .then(() => {
                this.showToast('Success', 'Contact unmarked as present', 'success');
                this.fetchContacts();
            })
            .catch(error => this.handleErrors(error));
        }
    }

    handleCreateContact() {
        if (this.newFirstName && this.newLastName) {
            createAndMarkContact({ 
                firstName: this.newFirstName, 
                lastName: this.newLastName, 
                serviceDate: this.serviceDate 
            })
            .then(() => {
                this.newFirstName = '';
                this.newLastName = '';
                this.showToast('Success', 'New contact added and marked as present', 'success');
                this.fetchContacts();
            })
            .catch(error => this.handleErrors(error));
        } else {
            this.showToast('Error', 'Please enter both first and last name', 'error');
        }
    }

    handleErrors(error) {
        this.errorMessage = error.message || 'Unknown error';
        this.showToast('Error', this.errorMessage, 'error');
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
