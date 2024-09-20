export default populizeAddress = (location,isPickup) => {
  if(!location) return '';
  var streetNo = "";
  var street = "";
  var district = "";
  var postalCode = "";
  var city = "";
  var region = "";

  if(isPickup === 'Single'){
    if (location.streetNo != null) {
      streetNo = location.streetNo;
    }
    if (location.street != null) {
      street = location.street;
    }
    if (location.postalCode != null) {
      postalCode = location.postalCode;
    }
    if (location.district != null) {
      district = location.district;
    }
    if (location.city != null) {
      city = location.city;
    }
    if (location.region != null) {
      region = location.region;
    }
    
  }
  else if(isPickup){
    if (location.pickupStreetNo != null) {
      streetNo = location.pickupStreetNo;
    }
    if (location.pickupStreet != null) {
      street = location.pickupStreet;
    }
    if (location.pickupPostalCode != null) {
      postalCode = location.pickupPostalCode;
    }
    if (location.pickupDistrict != null) {
      district = location.pickupDistrict;
    }
    if (location.pickupCity != null) {
      city = location.pickupCity;
    }
    if (location.pickupRegion != null) {
      region = location.pickupRegion;
    }
    
  }
  else{
    if (location.destinationStreetNo != null) {
      streetNo = location.destinationStreetNo;
    }
    if (location.destinationStreet != null) {
      street = location.destinationStreet;
    }
    if (location.destinationPostalCode != null) {
      postalCode = location.destinationPostalCode;
    }
    if (location.destinationDistrict != null) {
      district = location.destinationDistrict;
    }
    if (location.destinationCity != null) {
      city = location.destinationCity;
    }
    if (location.destinationRegion != null) {
      region = location.destinationRegion;
    }
  
  }

  if(streetNo) return `${streetNo}, ${region}`;
  else if(street && city) return `${street}, ${city}, ${region}`;
  else if(!street && postalCode && city) return `${postalCode}, ${city}, ${region}`;
  else if(!street && !postalCode && city) return `${city}, ${district}, ${region}`;
  else if(!street && !city && district) return `${district}, ${region}`;
}