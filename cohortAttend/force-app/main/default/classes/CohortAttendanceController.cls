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
    public static Worshipper__c markContactPresent(Id contactId, Date serviceDate) {
        // Assume contactId is a valid ID of an existing Contact
        Worshipper__c newWorshipper = new Worshipper__c(Contact_Lookup__c = contactId, Date__c = serviceDate);
        insert newWorshipper;
        return newWorshipper;
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
        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Contact createWorshipCohortContact(String firstName, String lastName) {
    Contact newContact = new Contact(FirstName = firstName, LastName = lastName, Worship_Cohort__c = true);
    insert newContact;
    return newContact;
    }

    @AuraEnabled
    public static Communion__c createCommunionRecord(Id contactId, Date serviceDate){
        try {
            Communion__c Communion = new Communion__c (Date__c = serviceDate, Contact__c = contactId, Name = serviceDate + ': ' + contactId); 
            insert Communion;
            return Communion;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void unmarkContactPresent(Id worshipperId) {
        delete [SELECT Id FROM Worshipper__c WHERE Id = :worshipperId LIMIT 1];
    }

    @AuraEnabled(cacheable=true)
    public static List<Worship_Service__c> getWorshipServiceRecords() {
        return [SELECT Id, Date__c, Number_in_Attendance__c FROM Worship_Service__c ORDER BY Date__c DESC];
    }

}
