// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents

List<Contact> contactsToInsert = new List<Contact>{
    new Contact(FirstName='Alex', LastName='Johnson', Worship_Cohort__c=true),
    new Contact(FirstName='Casey', LastName='Lee', Worship_Cohort__c=true),
    new Contact(FirstName='Jordan', LastName='Smith', Worship_Cohort__c=true),
    new Contact(FirstName='Taylor', LastName='Brown', Worship_Cohort__c=true),
    new Contact(FirstName='Jamie', LastName='Garcia', Worship_Cohort__c=true)
};

insert contactsToInsert;

