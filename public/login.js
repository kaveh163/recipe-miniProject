$(function() {
    $.ajax({
        method: "GET",
        url: '/login',
        success: function(data) {
            if(data.error[0]) {
                $('#alert').empty();
                $('#alert').css('display', 'block');
                $('#alert').append(data.error[0]);
            }
        }
    })
})