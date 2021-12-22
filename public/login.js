$(function() {
    $.ajax({
        method: "GET",
        url: '/login',
        success: function(data) {
            if(data !== "undefined") {
                $('#alert').empty();
                $('#alert').css('display', 'block');
                $('#alert').append(data.error[0]);
            }
        }
    })
})