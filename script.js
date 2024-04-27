// Store original quantities
var originalQuantities = {};

// Function to parse quantity from string
function parseQuantity(parts) {
    var quantity = 0;
    parts.forEach(function(part) {
        var fraction = part.split("/");
        if (fraction.length === 2) {
            quantity += parseInt(fraction[0]) / parseInt(fraction[1]);
        } else if (!isNaN(parseFloat(part))) {
            quantity += parseFloat(part);
        }
    });
    return quantity;
}

// Function to format quantity for display
function formatQuantity(quantity) {
    var whole = Math.floor(quantity);
    var fraction = quantity - whole;
    if (whole !== 0) {
        if (fraction === 0) {
            return whole.toString();
        } 
        else if (fraction === 0.25) {
            return whole + " 1/4";
        } 
        else if (fraction === 0.5) {
            return whole + " 1/2";
        } 
        else if (fraction === 0.75) {
            return whole + " 3/4";
        } 
        else if (fraction.toFixed(2) === "0.50") {
            return whole + " 1/2";
        } 
        else {
            return quantity.toFixed(2);
        }
    }
    else {
        if (fraction === 0.25) {
            return "1/4";
        } 
        else if (fraction === 0.5) {
            return "1/2";
        } 
        else if (fraction === 0.75) {
            return "3/4";
        } 
        else if (fraction.toFixed(2) === "0.50") {
            return "1/2";
        } 
        else {
            return quantity.toFixed(2);
        }
    }
}

// Function to update original quantities based on current displayed quantities
function storeOriginalQuantities() {
    // Get all the <label> elements inside the form
    var labels = document.querySelectorAll(".ingredients label");

    // Iterate over each label
    labels.forEach(function(label) {
        // Get the text content of the label and split it into parts
        var labelText = label.textContent.trim();
        var parts = labelText.split(" ");

        // Get the last two words in the content as the key for originalQuantities
        var key;
        if (parts.length > 3) {
            key = parts.slice(-2).join(" ");
        }
        else {
            key = parts[parts.length - 1];
        }

        // Parse the quantity from the rest of the content
        var quantity;
        if (parts.length > 3){
            quantity = parseQuantity(parts.slice(0, -2));
        }
        else {
            quantity = parseQuantity(parts);
        }

        // Store the quantity in originalQuantities
        if (!isNaN(quantity)) {
            originalQuantities[key] = quantity;
        }
    });
}

// Call the function to store original quantities when the page is loaded
document.addEventListener("DOMContentLoaded", function() {
    storeOriginalQuantities();
});

function scaleRecipe() {
    // Get the batch input value
    var batchInput = parseInt(document.getElementById("batchInput").value);

    // Check if batchInput is valid
    if (batchInput <= 0 || isNaN(batchInput)) {
        alert("Please enter a valid number of batches.");
        return;
    }

    // Get all the <label> elements inside the form
    var labels = document.querySelectorAll(".ingredients label");

    // Iterate over each label
    labels.forEach(function(label) {
        // Get the text content of the label and split it into parts
        var labelText = label.textContent.trim();
        var parts = labelText.split(" ");

        // Get the last two words in the content as the key for originalQuantities
        var key 
        if (parts.length > 3) {
            key = parts.slice(-2).join(" ");
        }
        else {
            key = parts[parts.length-1];
        }

        // Get the original quantity from originalQuantities
        var originalQuantity = originalQuantities[key];

        // If originalQuantity exists, scale it and update the label text
        if (!isNaN(originalQuantity)) {
            var scaledQuantity = originalQuantity * batchInput;
            var remainingParts;
            if (isNaN(parts[1].charAt(0))) {
                remainingParts = parts.slice(1).join(" ");
            }
            else {
                remainingParts = parts.slice(2).join(" ");
            }

            // Update the label text with the scaled quantity and remaining parts
            if (!isNaN(parts[0].charAt(0))) {
                label.textContent = formatQuantity(scaledQuantity) + " " + remainingParts;
            }
        }
    });
}
