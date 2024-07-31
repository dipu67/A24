// Get the modal
var modal = document.getElementById("postModal");

// Get the button that opens the modal
var btn = document.getElementById("postButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "flex";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Handle form submission with AJAX
$('#postForm').submit(function(event) {
    event.preventDefault(); // Prevent default form submission
    var postContent = $('#postContent').val();
    
    $.ajax({
        type: 'POST',
        url: '/posts',
        data: JSON.stringify({ content: postContent }),
        contentType: 'application/json',
        success: function(response) {
            console.log('Post created successfully:', response);
            modal.style.display = "none"; // Close the modal after submitting
            $('#postContent').val(''); // Clear the input field
        },
        error: function(error) {
            console.error('Error creating post:', error);
        }
    });
});
