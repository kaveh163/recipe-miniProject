$(function(){
    $.ajax({
        method: 'GET',
        url:'http://localhost:3000/loggedin',
        success: function(data) {
            if(data) {
                $('#logged').css('display', 'none');
                $('#reg').css('display', 'none');
            } else {
                $('#logged').css('display', 'block');
                $('#reg').css('display', 'block');
            }
        }
    })
})