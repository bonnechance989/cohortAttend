import { LightningElement, track } from 'lwc';
import createWorshipCohortContact from '@salesforce/apex/CohortAttendanceController.createWorshipCohortContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class WorshipCohortContactCreator extends LightningElement {
    @track firstName = '';
    @track lastName = '';

    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }

    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }

    createContact() {
        console.log('createContact method called'); // Debugging line
        createWorshipCohortContact({ firstName: this.firstName, lastName: this.lastName })
            .then(contact => {
                this.showToast('Success', 'Contact created successfully', 'success');
                
                // after clicking button clear the fields
                this.firstName = '';
                this.lastName = '';
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }
    

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}