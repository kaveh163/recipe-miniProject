$(function() {
    $.ajax({
        method: "GET",
        url: 'http://localhost:3000/success',
        success: function(data) {
            if(data.success[0]) {
                let lastItem = data.success.pop();
                $('#alert').empty();
                $('#alert').css('display', 'block');
                // $('#alert').append(data.success[0]);
                $('#alert').append(lastItem);
            }
        }
    });
    $.ajax({
        method: "GET",
        url: 'http://localhost:3000/logout/user',
        success: function(data) {
            if(data.logout[0]) {
                let lastItem = data.logout.pop();
                $('#alert').empty();
                $('#alert').css('display', 'block');
                // $('#alert').append(data.logout[0]);
                $('#alert').append(lastItem);
            }
        }
    })
});