public with sharing class CohortAttendanceController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getWorshipCohortContacts(Date serviceDate) {
        return [
            SELECT Id, FirstName, LastName
            FROM Contact 
            WHERE Worship_Cohort__c = true
        ];
    }

    @AuraEnabled
    public static Worshipper__c markContactPresent(String firstName, String lastName, Date serviceDate) {
    // Check if a contact with the given name exists and is part of the worship cohort
    List<Contact> matchingContacts = [
        SELECT Id FROM Contact 
        WHERE FirstName = :firstName AND LastName = :lastName AND Worship_Cohort__c = true 
        LIMIT 1
    ];

    Id contactId;
    if (matchingContacts.isEmpty()) {
        // Create a new contact and mark as part of the worship cohort if none found
        Contact newContact = new Contact(FirstName = firstName, LastName = lastName, Worship_Cohort__c = true);
        insert newContact;
        contactId = newContact.Id;
    } else {
        // Use the ID of the existing contact
        contactId = matchingContacts[0].Id;
    }

    // Check for an existing Worshipper__c record for the specific service date
    List<Worshipper__c> existingWorshippers = [
        SELECT Id FROM Worshipper__c 
        WHERE Contact_Lookup__c = :contactId AND Date__c = :serviceDate 
        LIMIT 1
    ];

    if (existingWorshippers.isEmpty()) {
        // Create new Worshipper__c record if no attendance marked for this date
        Worshipper__c newWorshipper = new Worshipper__c(Contact_Lookup__c = contactId, Date__c = serviceDate);
        insert newWorshipper;
        return newWorshipper;
    } else {
        // Return existing Worshipper__c record if attendance already marked
        return existingWorshippers[0];
    }
}
    @AuraEnabled
    public static Worship_Service__c createWorshipAttendanceRecord (Date serviceDate, Integer totalAttendance) {
        try {
            Worship_Service__c attendanceRecord = new Worship_Service__c (
                Date__c = serviceDate,
                Number_in_Attendance__c = totalAttendance
            );
            insert attendanceRecord;
            return attendanceRecord;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

        @AuraEnabled
        public static Contact createAndMarkContact(String firstName, String lastName, Date serviceDate) {
            List<Contact> contactsToInsert = new List<Contact>();
            
            Contact newContact = new Contact();
            newContact.FirstName = firstName;
            newContact.LastName = lastName;
            newContact.Worship_Cohort__c = true;  // Set Worship_Cohort__c to true
    
            contactsToInsert.add(newContact);
    
            try {
                insert contactsToInsert;
            } catch (DmlException e) {
                throw new AuraHandledException('Error creating new contact: ' + e.getMessage());
            }
            return contactsToInsert[0];
        }

    @AuraEnabled
    public static void unmarkContactPresent(Id worshipperId) {
        delete [SELECT Id FROM Worshipper__c WHERE Id = :worshipperId LIMIT 1];
    }
}