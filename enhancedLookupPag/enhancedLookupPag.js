import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import searchRecords from '@salesforce/apex/LookupController.searchRecordsPag';
import countRecords from '@salesforce/apex/LookupController.countRecords';

export default class EnhancedLookupPag extends NavigationMixin(LightningElement) {
    @track results = [];
    @track isLoading = false;
    @track totalRecords = 0;
    @track currentPage = 1;
    @track totalPages = 1;
    @track pageSize = 5;
    hasResults = false;
    searchTerm = '';
    recordPageUrl;

    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage >= this.totalPages;
    }

    handleSearchChange(event) {
        this.searchTerm = event.target.value;
        if (this.searchTerm.length >= 2) {
            this.currentPage = 1;
            this.search();
        } else {
            this.results = [];
            this.hasResults = false;
        }
    }

    search() {
        this.isLoading = true;
        searchRecords({ searchTerm: this.searchTerm, pageSize: this.pageSize, pageNumber: this.currentPage })
            .then((result) => {
                this.results = result;
                this.hasResults = result.length > 0;
                this.isLoading = false;
                return countRecords({ searchTerm: this.searchTerm });
            })
            .then((count) => {
                this.totalRecords = count;
                this.totalPages = Math.ceil(count / this.pageSize);
            })
            .catch((error) => {
                this.results = [];
                this.hasResults = false;
                this.isLoading = false;
                console.error('Error:', error);
            });
    }

    handleResultClick(event) {
        event.preventDefault();
        event.stopPropagation();     
        const selectedId = event.currentTarget.dataset.id;
        console.log('selectedId:', selectedId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId : selectedId,
                actionName: 'view'
            }
        }).then((url) => {
            this.recordPageUrl = url;
        });
    }

    handleNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.search();
        }
    }

    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.search();
        }
    }
}