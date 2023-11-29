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
            // Create a new Communion record with the Contact ID and Service Date
            Communion__c communionRecord = new Communion__c(
                Date__c = serviceDate, 
                Contact__c = contactId,
                Name = 'Communion for : ' + contactId // Set the Name field using the Contact ID
            );
    
            // Insert the Communion record into the database
            insert communionRecord;
    
            // Return the newly created Communion record
            return communionRecord;
        } 
        catch (Exception e) {
            // Handle exceptions
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

    @AuraEnabled
    public static void createGroupAttendanceRecord (String groupNameInput, Date meetingDate, Integer attendanceTotalInput) {
        List<Group_1__c> newGroup1List = new List<Group_1__c> (); 
        List<Group_2__c> newGroup2List = new List<Group_2__c> ();  
        List<Group_3__c> newGroup3List = new List<Group_3__c> ();  
        
        try {
        if(groupNameInput == 'Group 1') {
            Group_1__c newGroup1 = new Group_1__c(
            Date__c = meetingDate,
            Attendance__c = attendanceTotalInput,
            Name = 'Group 1');
            newGroup1List.add(newGroup1);
        }
        else if (groupNameInput == 'Group 2') {
            Group_2__c newGroup2 = new Group_2__c(
            Date__c = meetingDate,
            Attendance__c = attendanceTotalInput,
            Name = 'Group 2');
            newGroup2List.add(newGroup2);
        }
        else if(groupNameInput == 'Group 3') {
            Group_3__c newGroup3 = new Group_3__c(
            Date__c = meetingDate,
            Attendance__c = attendanceTotalInput,
            Name = 'Group 3');
            newGroup3List.add(newGroup3);
        }
        
        if (!newGroup1List.isEmpty()) {
            insert newGroup1List;
        }
        if (!newGroup2List.isEmpty()) {
            insert newGroup2List;
        }
        if (!newGroup3List.isEmpty()) {
            insert newGroup3List;
        }
        }   
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
            
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsInGroup1(Date serviceDate) {
        return [
            SELECT Id, FirstName, LastName
            FROM Contact 
            WHERE Group_1__c = true
        ];
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsInGroup2(Date serviceDate) {
        return [
            SELECT Id, FirstName, LastName
            FROM Contact 
            WHERE Group_2__c = true
        ];
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsInGroup3(Date serviceDate) {
        return [
            SELECT Id, FirstName, LastName
            FROM Contact 
            WHERE Group_3__c = true
        ];
    }
    @AuraEnabled
public static Attendee__c markContactInGroupPresent(Id contactId, Date meetingDate, String groupName) {
    Attendee__c newAttendee = new Attendee__c(Contact__c = contactId, Date__c = meetingDate, Name = groupName);
    
    if (groupName == 'Group 1') {
        newAttendee.Group__c = true;
    }
    if (groupName == 'Group 2') {
        newAttendee.Group_2__c = true;
    }
    if (groupName == 'Group 3') {
        newAttendee.Group_3__c = true;
    }

    insert newAttendee;
    return newAttendee;
    }   
    @AuraEnabled
    public static void unmarkContactInGroupPresent(Id contactId) {
        delete [SELECT Contact__c FROM Attendee__c WHERE Contact__c = :contactId LIMIT 1];
    }

    @AuraEnabled(cacheable=true)
    public static List<Group_1__c> getGroupOneAttendanceRecords() {
        return [SELECT Id, Date__c, Attendance__c FROM  Group_1__c ORDER BY Date__c DESC];
    }
    @AuraEnabled(cacheable=true)
    public static List<Group_2__c> getGroupTwoAttendanceRecords() {
        return [SELECT Id, Date__c, Attendance__c FROM  Group_2__c ORDER BY Date__c DESC];
    }
    @AuraEnabled(cacheable=true)
    public static List<Group_3__c> getGroupThreeAttendanceRecords() {
        return [SELECT Id, Date__c, Attendance__c FROM  Group_3__c ORDER BY Date__c DESC];
    }

}