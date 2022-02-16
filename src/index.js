import './styles.scss';
import $ from "jquery";

var retrievedData = []

///// stringifies integer and adds commas for 4+ digit numbers /////
const formatNumbersToIncludeCommas = num => {
  const regEx = /\B(?=(\d{3})+(?!\d))/g;
  return num.toString().replace(regEx, ",");
};

const viewPropertyDetails = id => {
  $("#lightbox-details").empty();
  let selectedProperty = {};
  let propertyChannel = "";
  $("#property-lightbox").css("display", "flex");
  retrievedData.forEach(element => {
    if (element.property_id == id) {
      selectedProperty = element;
    };
  });
  if (selectedProperty.primary_channel == "sales") {
    propertyChannel = "sale";
  } else {
    propertyChannel = "rent"
  };
  $("#lightbox-details").append(`<h3>${selectedProperty.bedrooms} bed ${selectedProperty.property_type} for ${propertyChannel}</h3>`);
  $("#lightbox-details").append(`<img class="property-image" src="http://mr0.homeflow.co.uk/${selectedProperty.photos[0]}">`);
  $("#lightbox-details").append(`<h4>${selectedProperty.display_address}</h4>`);
  $("#lightbox-details").append(`<h4>${selectedProperty.bedrooms} bed, ${selectedProperty.bathrooms} bath, ${selectedProperty.reception_rooms} reception</h4>`);
  $("#lightbox-details").append(`<h4>Contact <span class="phone-number">${selectedProperty.contact_telephone}</span> for enquiries.</h4>`);
}

///// retrieves data from API via user's search input /////
const getData = jsonArray => {
  retrievedData = jsonArray;
  console.log(retrievedData);
  retrievedData.forEach(element => {
    let priceHeading = "";
    if (element.primary_channel == "sales") {
      priceHeading = "PRICE";
    } else {
      priceHeading = "PCM"
    };
    $("#output-container").append(`
      <div class="property-card" prop-id="${element.property_id}">
      <img class="property-image-thumbnail" src="http://mr0.homeflow.co.uk/${element.photos[0]}">
        <p class="display-address">${element.display_address}</p>
        <div class="property-stats">
          <div class="stat"><p>${element.bedrooms}</p> <p class="sub-heading">BED</p></div>
          <div class="stat"><p>${element.bathrooms}</p> <p class="sub-heading">BATH</p></div>
          <div class="stat"><p>£${formatNumbersToIncludeCommas(element.price_value)}</p> <p class="sub-heading">${priceHeading}</p></div>
        </div>
      </div>
      `);
  });
};

///// EVENT LISTENER: Property card /////
$(document).on("click", ".property-card", function() {
  viewPropertyDetails($(this).attr("prop-id"));
});

///// EVENT LISTENER: Exit button for property lightbox /////
$("#exit-lightbox-button").on("click", function() {
  $("#property-lightbox").css("display", "none");
});

///// EVENT LISTENER: Search button ////
$("#fetch-button").on("click", function() {
  fetch(`/api/properties?location=${$("#search-input").val()}`)
  .then(response => response.json())
  .then((json) => {
    $("#output-container").empty();
    getData(json.result.properties.elements);
  })
  .catch((err) => {
    console.error(err);
    $("#app").innerHTML = '<p>Something went wrong. Check the console for details.</p>';
  });
});