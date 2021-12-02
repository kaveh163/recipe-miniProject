$(function() {
    $.ajax({
        method: "GET",
        url: '/register',
        success: function(data) {
            if(data.info[0]) {
                $('#alert').empty();
                $('#alert').css('display', 'block');
                $('#alert').append(data.info[0]);
            }
        }
    })
})