$(function() {
    $.ajax({
        method: "GET",
        url: '/register',
        success: function(data) {
            if(data !== "undefined") {
                $('#alert').empty();
                $('#alert').css('display', 'block');
                $('#alert').append(data.info[0]);
            }
        }
    })
})