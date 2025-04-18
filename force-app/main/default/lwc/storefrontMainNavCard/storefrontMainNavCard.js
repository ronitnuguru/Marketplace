import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getStorefrontCollectionItems from '@salesforce/apex/MarketplaceController.getStorefrontCollectionItems';

export default class StorefrontMainNavCard extends LightningElement {

    @api selectedNavItem;

    navCollections;
    navCollectionsError;
    navCollectionsNull;
    itemDetails;

    displaySpinner;

    @wire(getStorefrontCollectionItems)
    wiredNavCollections({ error, data }) {
        if (data) {
            this.displaySpinner = false;
            this.navCollections = data;
            this.navCollectionsError = undefined;
            this.navCollectionsNull = this.navCollections.length === 0;
            if(this.navCollections){
                this.selectedNavItem = this.navCollections[0].Name;
                this.manualHandleNavSelect(this.selectedNavItem);
            }
        } else if (error) {
            this.displaySpinner = false;
            this.navCollections = undefined;
            this.navCollectionsError = error;
            console.error(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error",
                    message: error,
                    variant: "error"
                })
            );
        }
    }

    handleNavSelect(event){
        this.selectedNavItem = event.detail.name;
        if(this.navCollections){
            this.itemDetails = this.navCollections.find(obj => obj.Name === this.selectedNavItem);
        }
    }

    manualHandleNavSelect(selectedNavItem){
        if(this.navCollections){
            this.itemDetails = this.navCollections.find(obj => obj.Name === selectedNavItem);
        }
    }
}