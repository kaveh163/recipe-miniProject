// for post.html
$(function () {
    let values = [];
    let values2 = [];
    $('#sel').on('change', function () {
        let value = $(this).val();
        console.log(typeof (value));
        values.forEach(function (currValue, index) {
            if (currValue === value) {
                values.splice(index, 1);
            }
        })
        values.push(value);
        // values = values + value;
        $('#txt').val(values);
    })
    $('#ing-btn').on('click', function (event) {
        event.preventDefault();
        // values = [];
        let value = $('#ing').val();
        // console.log(value);
        let valArr = value.split(',');
        let valArr2 = value.split(' ');
        // console.log(valArr);
        // console.log(valArr2);
        $('#ing').val("");
        let patt = /[^a-zA-Z]/
        let result = value.match(patt);
        // console.log(result);
        if (valArr.length === 1 && valArr2.length === 1 && result === null) {
            values2.forEach(function (currValue, index) {
                if (currValue === value) {
                    values2.splice(index, 1);
                }
            })
            values2.push(value.toLowerCase());
            $('#txt').val(values2);
        }


    })
    //clear list
    $('#list-btn').on('click', function (event) {
        event.preventDefault();
        $('#txt').val("");
        values = [];
        values2 = [];
    })
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/thanks",
        success: function (data) {
            let myHTML = "";
            $('#sel').empty();
            data.forEach((value, index) => {
                myHTML += `<option>${value}</option>`
            })
            // $('#demo').append(data);
            $('#sel').append(myHTML);

        },
        error: function (textStatus) {
            console.log(textStatus);
        }
    })
})