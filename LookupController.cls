public with sharing class LookupController {
    @AuraEnabled
    public static List<sObject> searchRecords(String searchTerm) {
        String query = '%' + searchTerm + '%';
        return [SELECT Id, Name 
                FROM Account 
                WHERE Name LIKE :query 
                WITH SECURITY_ENFORCED 
                LIMIT 10];
    }

    @AuraEnabled
    public static List<sObject> searchRecordsPag(String searchTerm, Integer pageSize, Integer pageNumber) {
        String query = '%' + searchTerm + '%';
        Integer offset = (pageNumber - 1) * pageSize;
        return [SELECT Id, Name 
                FROM Account 
                WHERE Name LIKE :query 
                WITH SECURITY_ENFORCED 
                LIMIT :pageSize 
                OFFSET :offset];
    }

    @AuraEnabled
    public static Integer countRecords(String searchTerm) {
        String query = '%' + searchTerm + '%';
        return [SELECT COUNT()
                FROM Account 
                WHERE Name LIKE :query
                WITH SECURITY_ENFORCED];
    }
}