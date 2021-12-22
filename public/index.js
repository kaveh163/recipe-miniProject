$(function () {

    // ajax to flash
    $.ajax({
        method: "GET",
        url: '/flash',
        success: function (data) {
            
            if (data !== "undefined") {
                console.log('messArray', JSON.stringify(data.mess));
                let lastItem = data.mess.pop();
                $('#alert').empty();
                $('#alert').css('display', 'block');
                $('#alert').append(lastItem);
                // $('#alert').append(data.mess[0].message);
                setTimeout(function () {
                    $('#alert').empty();
                    $('#alert').css('display', 'none');
                }, 3000)



            } else {
                // let lastItem = data.success[0];
                $('#alert').empty();
                $('#alert').css('display', 'none');
            }
        }
    });
    // end ajax to flash

    // $.ajax({
    //     method: "GET",
    //     url: 'http://localhost:3000/success',
    //     success: function (data) {
    //         if (data.success[0]) {
    //             // if (data.success.length !== 0) {
    //             let lastItem = data.success.pop();
    //             $('#alert').empty();
    //             $('#alert').css('display', 'block');
    //             // $('#alert').removeClass('invisible');
    //             // $('#alert').addClass('visible')

    //             // $('#alert').append(data.success[0]);
    //             $('#alert').append(lastItem);
    //             // $('#alert').append(data.success[0].message);
    //             // }


    //         } else {
    //             // let lastItem = data.success[0];
    //             $('#alert').empty();
    //             $('#alert').css('display', 'none');
    //         }
    //     }
    // });


    // $.ajax({
    //     method: "GET",
    //     url: 'http://localhost:3000/logout/user',
    //     success: function (data) {
    //         if (data.logout[0]) {
    //             // if (data.logout.length !== 0) {
    //             let lastItem = data.logout.pop();
    //             $('#alert').empty();
    //             // $('#alert').removeClass('invisible');
    //             // $('#alert').addClass('visible')
    //             $('#alert').css('display', 'block');
    //             // $('#alert').addClass('visible')
    //             // $('#alert').append(data.logout[0]);
    //             $('#alert').append(lastItem);
    //             // $('#alert').append(data.logout[0].message)
    //             // }


    //         }
    //     }
    // })
});